// src/components/PanoramaViewer.js
import React, { useRef, useEffect, useState } from 'react';
import { Pannellum } from 'pannellum-react';
// import 'pannellum-react/lib/pannellum.css';

const PanoramaViewer = (
    { 
        pitch = 0, 
        yaw = 0, 
        onRelease, 
        onSave, 
        source,
        ...props 
    }
) => {
  const pannellumRef = useRef(null);
  const [parsedSource, setParsedSource] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);

  let elem = document.getElementsByClassName('pnlm-dragfix')[0];
  
  var old_element = document.getElementsByClassName('pnlm-dragfix')[0];
  if ( old_element   ){
    console.log('entro')
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
  }




  useEffect(() => {
    if (source) {
      try {
        const jsonSource = JSON.parse(source);
        jsonSource.scenes.forEach(scene => {
          scene.image = require(`../assets/${scene.image.split('/').pop()}`);
        });
        setParsedSource(jsonSource);
        setCurrentScene(jsonSource.scenes[0]);
      } catch (error) {
        console.error("Invalid JSON source:", error);
      }
    }
  }, [source]);

  useEffect(() => {
    const viewer = pannellumRef.current?.getViewer();
    if (viewer && currentScene) {
      viewer.on('mouseup', handleMouseUp);
      viewer.setPitch(pitch);
      viewer.setYaw(yaw);
    }

    return () => {
      if (viewer) {
        viewer.off('mouseup', handleMouseUp);
      }
    };
  }, [onRelease, pitch, yaw, currentScene]);

  const handleMouseUp = () => {
    const viewer = pannellumRef.current.getViewer();
    const currentPitch = viewer.getPitch();
    const currentYaw = viewer.getYaw();
    if (onRelease) {
       onRelease({ pitch: currentPitch, yaw: currentYaw });
    }
  };

  const handleNavigationClick = (sceneId, pitch, yaw) => {
    const newScene = parsedSource.scenes.find(scene => scene.id === sceneId);
    if (newScene) {
        newScene.pitch = pitch;
        newScene.yaw = yaw;
        console.log( 'set this scene: ', newScene)
        setCurrentScene(newScene);
    }
  };

  return (
    <div>
      {currentScene && (
        <Pannellum
          ref={pannellumRef}
          width="90vw"
          height="90vh"
          image={currentScene.image}
          pitch={currentScene.pitch}
          yaw={currentScene.yaw}
          autoLoad
          {...props}
        >
            {currentScene.hotSpot.map((hotspot, index) => (
                <Pannellum.Hotspot
                    key={index}
                    type={"custom"}
                    pitch={hotspot.pitch}
                    yaw={hotspot.yaw}
                    cssClass={hotspot.cssClass}
                    handleClick={() => {
                        if (hotspot.type === 'navigation') {
                            handleNavigationClick(hotspot.scene, hotspot.pitch, hotspot.yaw);
                        }
                    }}
                />
            ))}
        </Pannellum>
      )}
      <button onClick={onSave}>Save</button>
    </div>
  );
};

export default PanoramaViewer;
