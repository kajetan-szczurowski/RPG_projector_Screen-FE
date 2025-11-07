import { usersDataState } from "../GlobalState";
import { ClockType, ContextMenuStateType } from "../types";
import { publishObjectDeletion, publishObjectStateChange } from "./API/gameServer";
import { useContextMenu, openContextMenu  } from "./ContextMenuProvider";

const ANGLE_OFFSET_DEFAULT = 270;
const X_POINT_DEFAULT = 100;
const Y_POINT_DEFAULT = 100;
const SMALL_RADIUS_DEFAULT = 50;
const BIG_RADIUS_DEFAULT = 80;
const UNCHECKED_FILL_COLOR = '#493f33';
const CHECKED_FILL_COLOR = '#761a0d';
const BORDER_COLOR = '#9e8b52';


export default function Clock({clockData}: props) {
  const {id, label, chunks, completed} = clockData;
  const setContextOptions = useContextMenu();
  const clockID = `clock-canvas-${id}`;
  const userIsGM = usersDataState.value.isGM;

  setTimeout(() => drawClocks(clockID, chunks, completed), 100);
  return (
    <div className="clock-wrapper" onContextMenu={handleRightClick}>
        <h2 className="clock-label">{label}</h2>
        <canvas id = {clockID} width="200" height="180"></canvas>
    </div>
  )

    function handleRightClick(e: React.MouseEvent){
          e.preventDefault();
          if (!userIsGM) return;
          e.stopPropagation();
          setContextOptions(getContextMenuOptions());
          openContextMenu(e.pageX, e.pageY);
      }

function getContextMenuOptions(): ContextMenuStateType{
        return[
            {label: 'delete', action: () => publishObjectDeletion(clockData.id, 'clock')},
            {label: 'increase', action: () => setCompleted(String(completed + 1))},
            {label: 'decrease', action: () => setCompleted(String(completed - 1))}
        ]
    }


function setCompleted(newValue: string){
    publishObjectStateChange(id, 'completed', newValue, 'clock');
}

}



type props = {
    clockData: ClockType
}

function drawClocks(id: string, segments: number, checked: number, xpoint = X_POINT_DEFAULT, ypoint = Y_POINT_DEFAULT, smallRadius = SMALL_RADIUS_DEFAULT, bigRadius = BIG_RADIUS_DEFAULT, angleOffset = ANGLE_OFFSET_DEFAULT){
    if (segments < 3 || segments > 12 || checked > segments) return;
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx = ctxRaw;
    const rotateAngle = 360 / segments;
    const arcAngle = rotateAngle - 10;
    const rotateRadians = degreeToRadians(rotateAngle);
    const startAngleRadians = degreeToRadians(angleOffset+arcAngle/2);
    const endAngleRadians = degreeToRadians(angleOffset-arcAngle/2);
    const startAngleRadiansOffset = degreeToRadians(angleOffset-arcAngle/2 - 1);
    const endAngleRadiansOffset = degreeToRadians(angleOffset+arcAngle/2 + 1);
    let currentColor: string;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < segments; index++){
        currentColor =  (index + 1 <= checked)? CHECKED_FILL_COLOR : UNCHECKED_FILL_COLOR;
        drawPartOfRing(currentColor);
        ctx.translate(xpoint, ypoint);
        ctx.rotate(rotateRadians);
        ctx.translate(-xpoint, -ypoint);
    }


    function strokeArc(radius: number){
        ctx.beginPath();
        ctx.arc(xpoint, ypoint, radius, startAngleRadians, endAngleRadians, true);
        // console.log(xpoint, ypoint, radius, startAngleRadians, endAngleRadians)
        ctx.stroke();
    }

    function fillArc(color: string ){
        ctx.strokeStyle = color;
        let radius = smallRadius + 3;
        ctx.lineWidth = 5;
        while (radius < bigRadius){
            strokeArc(radius);
            radius = radius + 2;
        }
    }

    function partOfRingBorder(){
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(xpoint, ypoint, smallRadius, startAngleRadians, endAngleRadians, true);
        ctx.arc(xpoint, ypoint, bigRadius, startAngleRadiansOffset, endAngleRadiansOffset);
        ctx.arc(xpoint, ypoint, smallRadius, startAngleRadians, endAngleRadians, true);
        ctx.stroke();
    }

    function drawPartOfRing(color: string){
        ctx.beginPath();
        fillArc(color);
        partOfRingBorder();
    }
}

function degreeToRadians(degree: number){
    return degree * Math.PI / 180;
}