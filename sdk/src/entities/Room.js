class Room {
    constructor(obj) {
        this._id = obj.id;
        this._name = obj.name;
        this._roomHash = obj.roomHash;
        this._roomSessionId = obj.roomSessionId;
        this._assignedGateway = obj.assignedGateway;
        this._userCount = obj.userCount;
    }

    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get roomHash() {
        return this._roomHash;
    }
    get roomSessionId() {
        return this._roomSessionId;
    }
    get assignedGateway() {
        return this._assignedGateway;
    }
    get userCount() {
        return this._userCount;
    }
}
export default Room;