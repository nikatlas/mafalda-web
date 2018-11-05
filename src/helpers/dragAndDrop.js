import * as PIXI from 'pixi.js';
import EventManager from '../Game/services/EventManager';

const debug = (v) => {
    //console.log(v);
};
function dragAndDrop(sprite) {
// Sprite must be interactive and if container Hit Area must be specified!
    sprite
    // events for drag start
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove)

        .on('mouseout', onMouseOut)
        .on('mouseover', onMouseOver);

    sprite.placeFn = place.bind(sprite);

    sprite.stopDND = () => {
        debug("STOP DND");
        sprite
        // events for drag start
            .off('mousedown', onDragStart)
            .off('touchstart', onDragStart)
        // events for drag end
            .off('mouseup', onDragEnd)
            .off('mouseupoutside', onDragEnd)
            .off('touchend', onDragEnd)
            .off('touchendoutside', onDragEnd)
        //events for drag move
            .off('mousemove', onDragMove)
            .off('touchmove', onDragMove)
            
            .off('mouseout', onMouseOut)
            .off('mouseover', onMouseOver);
    };
}

function place(holder) {
    if(this.dragging) {
        holder.occupy(this);
        debug("Move Occupying");
    }
}

function onDragStart(event)
{
    // zIndex reference and increase in order to appear "above-all" when dragged
    this.zReference = this.zIndex;
    this.zIndex = 100;

    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.dragging = true;

    if(!this._movableTarget)this._movableTarget = new PIXI.Point();
    this.draggingOffset = this.data.getLocalPosition(this);

    this.draggingInitial = new PIXI.Point(this.position.x, this.position.y);

    EventManager.emit('CardDragging');
    // Add CardPlace Callback 
    EventManager.on('CardPlaced', this.placeFn);
}

function onDragEnd()
{
    // This may fit inside better?
    this.zIndex = this.zReference;
    //!!

    EventManager.emit('CardDraggingFinished');
    // Remove Card Placed Callbacks
    setTimeout(() => {
        EventManager.off('CardPlaced', this.placeFn);
        this.dragging = false;
        this.alpha = 1;
        // set the interaction data to null
        this.data = null;

        const holder = this.getHolder();
        let zzz = holder.getGlobalPosition();
        let ppp = this.parent.toLocal(zzz);
        this.moveTo(ppp);
        this.scaleTo(holder.scale.x);

        debug("Moved To Holder Position");
        debug(holder.position.x + "\t" + holder.position.y );
    }, 20);
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        var offset = this.draggingOffset;

        this._movableTarget.x = newPosition.x - offset.x * this.scale.x;
        this._movableTarget.y = newPosition.y - offset.y * this.scale.y;
        this.moveTo(this._movableTarget, 10);
        debug(this._movableTarget);
    }
}

function onMouseOut() {
    if(this.zoomable && !this.dragging) {
        const holder = this.getHolder();
        this.zIndex = 10;
        let zzz = holder.getGlobalPosition();
        let ppp = this.parent.toLocal(zzz);
        this.moveTo(ppp);
        this.scaleTo(holder.scale.x);
        debug("MovedOut To Holder Position");
    }
}

function onMouseOver() {
    if(this.zoomable) {
        const npos = new PIXI.Point();
        npos.copy(this.position);
        npos.y = -50;
        this.zIndex = 1000;
        this.moveTo(npos,500);
        this.scaleTo(1.5 ,500);
    }
}

export default dragAndDrop;