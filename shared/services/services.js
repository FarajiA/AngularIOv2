; (function () {
    angular.module('App')
        .factory('UserStore', ['$http', '$q', function ($http, $q) {
    var data = [];
    var UserObject = {};

    UserObject.setUser = function () {
        var deffered = $q.defer();
        $http.get(baseURL_CONSTANT + "api/accounts/user/")
        .success(function (d) {
            data = d.result;
            deffered.resolve(d.result);
        })
        .error(function (data, status) {
            deffered.reject(data);
            console.log("Request failed " + status);
        });
        return deffered.promise;
    };

    UserObject.getUser = function (user) {
        var deffered = $q.defer();
        data = user;
        deffered.resolve(data);
        return deffered.promise;
    };

    UserObject.data = function () { return data; };
    return UserObject;
}]).factory('CentralHub', ['$q', '$rootScope', 'AuthService', function ($q, $rootScope, AuthService) {
    var proxy = null;
    var connection = null;
    var forced = false;
    var initialize = function (hubName) {
        connection = $.hubConnection(signalRURL_CONSTANT, { useDefaultPath: false });
        connection.qs = { 'bearer_token': AuthService.authentication.token };
        proxy = connection.createHubProxy(hubName);

        proxy.on('notificationReceived', function (userName, photo, id, type, viewing, views) {
            var notification = {
                username: userName,
                photo: photo,
                userID : id,
                type: type,
                viewing: viewing,
                views: views
            };
            $rootScope.$emit("centralHubNotification", notification);
        });

        proxy.on('receiveMessage', function (message) {
            $rootScope.$emit('emit_NewMessage', message);
        });

        connection.start({ jsonp: true }).done(function (response) {
            console.log("Connection complete");
        });

        connection.disconnected(function () {
            if (!forced)
                setTimeout(function () { connection.start({ jsonp: true }); }, 5000);
        });

        return proxy;
    };

    var broadcast = function (proxyConnection, coords) {
        var deffered = $q.defer();
        proxyConnection.invoke('BroadcastUpdate', coords.latitude, coords.longitude).done(function (result) {
            deffered.resolve(result);
        });
        return deffered.promise;
    };

    var joinbroadcast = function (proxyConnection, username) {
        var deffered = $q.defer();
        proxyConnection.invoke('JoinBroadcastGroup', username).done(function (result) {
            deffered.resolve(result);
        });
        return deffered.promise;
    };

    var leavebroadcast = function (proxyConnection, userID) {
        var deffered = $q.defer();
        proxyConnection.invoke('LeaveGroup', userID).done(function (result) {
            deffered.resolve(result);
        });
        return deffered.promise;
    };

    var views = function (proxyConnection) {
        proxyConnection.on('updateViewing', function (views) {
            $rootScope.$emit("centralHubViewing", views);
        });
    };

    var streamBroadcast = function (proxyConnection) {        
        proxyConnection.on('receiveBroadcast', function (coords) {
            $rootScope.$emit("centralHubBroadcast", coords);
        });
    };

    var broadcastOff = function (proxyConnection) {
        proxyConnection.on('broadcastEnd', function (coords) {
            $rootScope.$emit("centralHubBroadcastOff", coords);
        });
    };

    var disconnect = function () {
        forced = true;
        connection.stop();
    };

    return {
        initialize: initialize,
        broadcast : broadcast,
        joinbroadcast: joinbroadcast,
        leavebroadcast: leavebroadcast,
        views: views,
        streamBroadcast: streamBroadcast,
        disconnect: disconnect
    };

   }]).factory('Encryption', ['$http', '$q', 'localStorageService', 'AuthService', 'UserStore', function ($http, $q, localStorageService, AuthService, UserStore) {
         var EncryptionObject = this;

         var keys = [];
         var Bits = 512;

         //escape the string then encode function
         function Base64Encode(str) {
             return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                 return String.fromCharCode('0x' + p1);
             }));
         };

         //decode the base64 string
         function Base64Decode(str) {
             return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
                 return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
             }).join(''));
         };
         
         EncryptionObject.Key = {
             privateKey: "",
             publicKey: ""
         };

         EncryptionObject.fillKeyData = function () {
             var keyData = localStorageService.get('KeyData');
             if (!_.isEmpty(keyData)) {
                 EncryptionObject.Key.privateKey = cryptico.generateRSAKey(Base64Decode(keyData.privateKey), Bits);
                 EncryptionObject.Key.publicKey = keyData.publicKey;
                 keys.push(EncryptionObject.Key.publicKey);
             }
         };

         EncryptionObject.clearKeyData = function () {
             localStorageService.remove('KeyData');
         };

         EncryptionObject.generatePrivateKey = function (passphrase, newPhrase) {
             var deffered = $q.defer();
             var RSAkey = cryptico.generateRSAKey(passphrase, Bits);
             var publicKey = cryptico.publicKeyString(RSAkey);
             
             if (!newPhrase) {
                 EncryptionObject.Key.privateKey = RSAkey;
                 localStorageService.set('KeyData', { privateKey: Base64Encode(passphrase), publicKey: publicKey });
                 deffered.resolve(true);
             }
             else {             
                 var msg = { 'key': publicKey };
                 $http.post(baseURL_CONSTANT + 'api/accounts/user/publickey', msg).success(function (response) {
                     EncryptionObject.Key.privateKey = RSAkey;
                     localStorageService.set('KeyData', { privateKey: Base64Encode(passphrase), publicKey: publicKey });
                     deffered.resolve(response);
                 }).error(function (err, status) {
                     deffered.reject(err);
                 });
             }
             return deffered.promise;
         };

         EncryptionObject.Encrypt = function (msgObject) {
             var deffered = $q.defer();
             var encrypted = cryptico.encrypt(msgObject.msg, msgObject.key, EncryptionObject.Key.privateKey);
             var object = {
                 'id': msgObject.id,
                 'key': msgObject.key,
                 'msg': encrypted.cipher
             };
             deffered.resolve(object);
             return deffered.promise;
         };
        
         EncryptionObject.Decrypt = function (msgEncrypted) {
             var deffered = $q.defer();
             var decrypted = cryptico.decrypt(msgEncrypted, EncryptionObject.Key.privateKey);
             deffered.resolve(decrypted.plaintext);
             return deffered.promise;
         };

         EncryptionObject.userPublicKey = function (userID) {
             var deffered = $q.defer();
             $http.get(baseURL_CONSTANT + 'api/accounts/user/publickey/' + userID).success(function (response) {
                 deffered.resolve(response);
             }).error(function (err, status) {
                 deffered.reject(err);
             });

             return deffered.promise;
         };

         EncryptionObject.verifyPassphrase = function (passphrase) {
             var deffered = $q.defer();

             var RSAkey = cryptico.generateRSAKey(passphrase, Bits);
             var publicKey = cryptico.publicKeyString(RSAkey);

             if (_.isEqual(publicKey, this.Key.publicKey))
                 deffered.resolve(true);
             else
                 deffered.resolve(false);

             return deffered.promise;
         };
         
         EncryptionObject.ActiveKeys = function () { return keys; };
         return EncryptionObject;
     }]).service('ControllerChecker', ['$controller', function ($controller) {
        return {
            exists: function (controllerName) {
                if (typeof window[controllerName] == 'function') {
                    return true;
                }
                try {
                    $controller(controllerName);
                    return true;
                } catch (error) {
                    return !(error instanceof TypeError);
                }
            }
        };
     }]).factory('Device', ['$http', '$q', function ($http, $q) {
         var data = [];
         var Device = {};

         Device.registered = function (token) {
             var deffered = $q.defer();
             var msg = { 'token': token };
             $http.post(baseURL_CONSTANT + "api/devices/registered", msg)
             .success(function (d) {
                 deffered.resolve(d);
             })
             .error(function (data, status) {
                 deffered.reject(data);
             });
             return deffered.promise;
         };
         Device.register = function (platform, model, token, push) {
             var deffered = $q.defer();
             var msg = { 'platform': platform, 'token': token, 'model': model, 'allowpush': push };
             $http.post(baseURL_CONSTANT + "api/devices", msg)
             .success(function (d) {
                 deffered.resolve(d);
             })
             .error(function (data, status) {
                 deffered.reject(data);
             });
             return deffered.promise;
         };

         Device.devices = function () {
             var deffered = $q.defer();
             $http.get(baseURL_CONSTANT + "api/devices")
             .success(function (d) {
                 data = d;
                 deffered.resolve(d);
             })
             .error(function (data, status) {
                 deffered.reject(data);
             });
             return deffered.promise;
         };

         Device.data = function () { return data; };
         return Device;
     }]).factory('UserView', function () {
        var view = {
            current: false
        };
        return {
            UserPageCurrent: function () {
                return view.current;
            },
            SetUserPageCurrent: function (current) {
                view.current = current;
            }
        };
     }).factory('Broadcast', ['$http', '$q', function ($http, $q) {
         var data = [];
         var Broadcast = {};

         Broadcast.On = function (coords, groupID, broadcastType) {
             var deffered = $q.defer();
             var msg = { 'Coords': { "Longitude": coords.longitude, "Latitude": coords.latitude }, "BroadcastGroupID": groupID, "BroadcastType": broadcastType };
             $http.post(baseURL_CONSTANT + "api/broadcast/on", msg)
             .success(function (d) {
                 data = d;
                 deffered.resolve(d);
             })
             .error(function (data, status) {
                 deffered.reject(data);
                 console.log("Request failed " + status);
             });
             return deffered.promise;
         };

         Broadcast.Broadcast = function (coords) {
             var deffered = $q.defer();
             var msg = { "Longitude": coords.longitude, "Latitude": coords.latitude };
             $http.post(baseURL_CONSTANT + "api/broadcast", msg)
             .success(function (d) {
                 deffered.resolve(d);
             })
             .error(function (data, status) {
                 deffered.reject(data);
                 console.log("Request failed " + status);
             });
             return deffered.promise;
         };

         Broadcast.Off = function () {
             var deffered = $q.defer();
             $http.put(baseURL_CONSTANT + "api/broadcast/off")
             .success(function (d) {
                 deffered.resolve(d);
             })
             .error(function (data, status) {
                 deffered.reject(data);
                 console.log("Request failed " + status);
             });
             return deffered.promise;
         };

         Broadcast.Notify = function (type, group) {
             var deffered = $q.defer();
             var msg = { 'type': type, 'group': group };
             $http.post(baseURL_CONSTANT + "api/broadcast/notify", msg)
             .success(function (d) {
                 deffered.resolve(d);
             })
             .error(function (data, status) {
                 deffered.reject(data);
                 console.log("Request failed " + status);
             });
             return deffered.promise;
         }

         Broadcast.data = function () { return data; };
         return Broadcast;
     }])/*.factory('GeoAlert', function () {
        var viewed = {
            seen: false
        };
        return {
            getGeoalert: function () {
                return viewed.seen;
            },
            setGeoalert: function (seen) {
                viewed.seen = seen;
            }
        };
    })*/.factory('UserView', function () {
        var view = {
            current: false
        };
        return {
            UserPageCurrent: function () {
                return view.current;
            },
            SetUserPageCurrent: function (current) {
                view.current = current;
            }
        };
    });
})();