class State {


    setState(data) {
        this.state = {
            ...this.state, 
            ...data
        };
        if(this.onStateUpdate)this.onStateUpdate();
    }
}
export default State;