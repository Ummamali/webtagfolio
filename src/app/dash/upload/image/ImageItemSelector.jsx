import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  provisionalAskThunk,
  provisionalBoxCreated,
  provisionalBoxDestroyed,
} from "../../../../store/ApplicationSlice";
import {
  convertBoundingBox,
  convertBoundingBoxToScaled,
  getCroppedImageFile,
} from "../../../../utilFuncs/utilFuncs";
// import { flashedSuccess } from "../../store/ApplicationSlice";

function pushAndGetSortedNewArray(boxArray, newBox) {
  const newArray = JSON.parse(JSON.stringify(boxArray));
  newArray.push(newBox);
  newArray.sort((a, b) => {
    const areaA = a.box[2] * a.box[3];
    const areaB = b.box[2] * b.box[3];
    return areaB - areaA;
  });
  return newArray;
}

export default function ImageSelector({ thisImage, modeIdx }) {
  const [startPoint, setStartPoint] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const provisionalBox = thisImage.provisionalBox;

  const inputRef = useRef();
  const artboardRef = useRef();
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    if (thisImage.file) {
      reader.readAsDataURL(thisImage.file);
    }
  }, [thisImage.file]);

  return (
    <div className="flex items-center justify-center">
      <div
        className={
          "relative inline-block " +
          (modeIdx === 0 ? "hover:cursor-crosshair" : "hover:cursor-default")
        }
        ref={artboardRef}
        onMouseDown={(event) => {
          if (modeIdx === 0) {
            const offsetX = event.clientX - artboardRef.current.offsetLeft;
            const offsetY = event.clientY - artboardRef.current.offsetTop;
            setStartPoint([offsetX, offsetY]);
            dispatch(provisionalBoxDestroyed({ imageName: thisImage.name }));
          }
        }}
        onMouseUp={() => {
          if (
            modeIdx === 0 &&
            dimensions !== null &&
            dimensions[0] > 10 &&
            dimensions[1] > 10
          ) {
            const originalBox = convertBoundingBox(
              startPoint[0],
              startPoint[1],
              dimensions[0],
              dimensions[1],
              thisImage.originalDimension.width,
              thisImage.originalDimension.height,
              artboardRef.current.clientWidth,
              artboardRef.current.clientHeight
            );
            dispatch(
              provisionalBoxCreated({
                imageName: thisImage.name,
                box: [
                  startPoint[0],
                  startPoint[1],
                  dimensions[0],
                  dimensions[1],
                ],
                originalPBox: originalBox,
              })
            );
            // then we ask the server to recognize any face in the box
            getCroppedImageFile(
              originalBox.x,
              originalBox.y,
              originalBox.width,
              originalBox.height,
              thisImage.file
            ).then((croppedImageFile) => {
              dispatch(provisionalAskThunk(croppedImageFile, thisImage.name));
            });
          }
          setDimensions(null);
          setStartPoint(null);
        }}
        onMouseMove={(event) => {
          if (modeIdx === 0 && startPoint !== null) {
            const offsetX = event.clientX - artboardRef.current.offsetLeft;
            const offsetY = event.clientY - artboardRef.current.offsetTop;
            const width = offsetX - startPoint[0];
            const height = offsetY - startPoint[1];
            if (width > 0 && height > 0) {
              setDimensions([width, height]);
            }
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            dispatch(provisionalBoxDestroyed({ imageName: thisImage.name }));
          }
        }}
      >
        {modeIdx === 0 && dimensions !== null ? (
          <div
            className="border border-black absolute rounded-sm bg-white/20"
            style={{
              top: `${startPoint[1]}px`,
              left: `${startPoint[0]}px`,
              width: `${dimensions[0]}px`,
              height: `${dimensions[1]}px`,
            }}
          ></div>
        ) : null}
        {modeIdx === 0 && provisionalBox !== null ? (
          <div
            className="border border-black/70 absolute rounded-sm bg-white/40"
            style={{
              left: `${provisionalBox[0]}px`,
              top: `${provisionalBox[1]}px`,
              width: `${provisionalBox[2]}px`,
              height: `${provisionalBox[3]}px`,
            }}
          ></div>
        ) : null}

        {/* Following is view for edit mode */}
        {modeIdx === 1
          ? thisImage.boxes.map((b, idx) => {
              const scaledBox = convertBoundingBoxToScaled(
                b.box.x,
                b.box.y,
                b.box.width,
                b.box.height,
                thisImage.originalDimension.width,
                thisImage.originalDimension.height,
                artboardRef.current.clientWidth,
                artboardRef.current.clientHeight
              );

              return (
                <div
                  className={
                    "border-2 border-black/40 bg-white/20 absolute rounded-sm hover:bg-gray-200/40 hover:border-black cursor-pointer "
                  }
                  key={`${b.box.x}${b.box.y}${b.box.width}${b.box.height} - ${idx}`}
                  style={{
                    left: `${scaledBox.x}px`,
                    top: `${scaledBox.y}px`,
                    width: `${scaledBox.width}px`,
                    height: `${scaledBox.height}px`,
                  }}
                ></div>
              );
            })
          : null}
        <Image
          src={imageUrl !== null ? imageUrl : "/logo.png"}
          height={600}
          width={2000}
          style={{ userSelect: "none", width: "auto", height: "600px" }}
          draggable={false}
        />
      </div>
    </div>
  );
}
