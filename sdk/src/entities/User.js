import UserStatus from '../constants/UserStatus';
import Util from '../util/Util';

class User {
    constructor(obj) {
        this._id = obj.id;
        this._name = obj.name;
        this._photo = obj.photo;

        this._deviceType = obj.deviceType;
        this._type = obj.type;

        this._sessionId = obj.sessionId;
        this._meetingId = obj.meetingId;
        this._roomHash = obj.roomHash;

        this._status = obj.status;

        this._permissios_bit_set = obj.permissions;
        this._features_bit_set = 0;

        this._layout = {};
        this._networkQualityUp = 0;
        this._networkQualityDown = 0;

        this._createTime = Util.now();
        this._updateTime = Util.now();
        this._lastPingTime = null;
        this._connectTime = null;
        this._mediaConnectTime = null;
        this._disconnectTime = null;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(newName) {
        this._name = newName;
    }

    get photo() {
        return this._photo
    }

    set photo(newPhoto) {
        this._photo = newPhoto;
    }

    get type() {
        return this._type;
    }

    get sessionId() {
        return this._sessionId;
    }

    get meetingId() {
        return this._meetingId;
    }

    get status() {
        return this._status;
    }

    set status(newStatus) {
        this._status = newStatus;
    }

    get layout() {
        return this._layout;
    }

    set layout(newLayout) {
        this._layout = newLayout;
    }

    get lastPingTime() {
        return this._lastPingTime;
    }

    set lastPingTime(newLastPingTime) {
        this._lastPingTime = newLastPingTime;
    }

    get connectTime() {
        return this._connectTime;
    }

    set connectTime(newConnectTime) {
        this._connectTime = newConnectTime;
    }

    get mediaConnectTime() {
        return this._mediaConnectTime;
    }

    set mediaConnectTime(newMediaConnectTime) {
        this._mediaConnectTime = newMediaConnectTime;
    }

    get updateTime() {
        return this._updateTime;
    }

    set updateTime(newUpdateTime) {
        this._updateTime = newUpdateTime;
    }

    get createTime() {
        return this._createTime;
    }

    set createTime(newCreateTime) {
        this._createTime = newCreateTime;
    }

    get disconnectTime() {
        return this._disconnectTime;
    }

    set disconnectTime(newDisconnectTime) {
        this._disconnectTime = newDisconnectTime;
    }

    hasPermission(p) {
        return ((this._permissios_bit_set & p) != 0);
    }

    addPermission(p) {
        this._permissios_bit_set |= p;
    }

    removePermission(p) {
        this._permissios_bit_set &= ~p;
    }

    isFeatureEnabled(feature) {
        return (
            ((this._permissios_bit_set & feature) != 0) && ((this._features_bit_set & feature) != 0)
        );
    }

    enableFeature(feature) {
        this._features_bit_set |= feature;
    }

    disableFeature(feature) {
        this._features_bit_set &= ~feature;
    }

    get networkQualityUp() {
        return this._networkQualityUp;
    }

    set networkQualityUp(newNetworkQualityUp) {
        this._networkQualityUp = newNetworkQualityUp;
    }

    get networkQualityDown() {
        return this._networkQualityDown;
    }

    set networkQualityDown(newNetworkQualityDown) {
        this._networkQualityDown = newNetworkQualityDown;
    }
}
export default User;