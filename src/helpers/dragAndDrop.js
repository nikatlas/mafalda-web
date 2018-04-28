import * as PIXI from 'pixi.js';
import EventManager from '../Game/services/EventManager';

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
        .on('touchmove', onDragMove);

    sprite.placeFn = place.bind(sprite);
}

function place(holder, dropCallback) {
    if(this.dragging) {
        this.placedPosition = this.parent.toLocal(holder.getGlobalPosition());
        this.placedScale = new PIXI.Point(holder.scale.x, holder.scale.y);
        if(dropCallback) {
            dropCallback(this);
        }
    }
}

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.dragging = true;
    
    this.draggingOffset = this.data.getLocalPosition(this);

    this.draggingInitial = new PIXI.Point(this.position.x, this.position.y);

    EventManager.emit('CardDragging');
    // Add CardPlace Callback 
    EventManager.on('CardPlaced', this.placeFn);
}

function onDragEnd()
{
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
    if(this.placedPosition) {
        this.moveTo(this.placedPosition);
        this.scaleTo(this.placedScale.x);
    } else {
        this.moveTo(this.draggingInitial);
    }

    EventManager.emit('CardDraggingFinished');
    // Remove Card Placed Callbacks
    EventManager.off('CardPlaced', this.placeFn);
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        var offset = this.draggingOffset;
        this.position.x = newPosition.x - offset.x * this.scale.x;
        this.position.y = newPosition.y - offset.y * this.scale.y;
    }
}
export default dragAndDrop;