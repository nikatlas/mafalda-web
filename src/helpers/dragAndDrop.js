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

    EventManager.on('CardPlaced', (position) => {
        if(sprite.dragging) {
            sprite.placedPosition = position;
        }
    });
}

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.dragging = true;
    
    var newPosition = this.data.getLocalPosition(this);
    this.draggingOffset = newPosition;

    this.draggingInitial   = this.data.getLocalPosition(this.parent);
    this.draggingInitial.x -= this.draggingOffset.x;
    this.draggingInitial.y -= this.draggingOffset.y;

    EventManager.emit('CardDragging');
}

function onDragEnd()
{
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
    if(this.placedPosition){
        this.position.x = this.placedPosition.x;
        this.position.y = this.placedPosition.y;
    } else {
        this.position.x = this.draggingInitial.x;
        this.position.y = this.draggingInitial.y;
    }



    EventManager.emit('CardDraggingFinished');
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x - this.draggingOffset.x;
        this.position.y = newPosition.y - this.draggingOffset.y;
    }
}
export default dragAndDrop;