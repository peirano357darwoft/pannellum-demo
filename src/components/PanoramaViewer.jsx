import React, { useRef, useEffect, useState } from 'react';
import { Pannellum } from 'pannellum-react';
import './styles/PanoramaViewer.css';

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
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleRightClick = (event) => {
      event.preventDefault();
      setModalPosition({ x: event.clientX, y: event.clientY });
      setShowModal(true);
    };

    const attachRightClickListener = () => {
      const elements = document.getElementsByClassName('pnlm-container');
      const elementsArray = Array.from(elements);
      elementsArray.forEach(element => {
        element.addEventListener('contextmenu', handleRightClick);
      });

      return () => {
        elementsArray.forEach(element => {
          element.removeEventListener('contextmenu', handleRightClick);
        });
      };
    };

    const timer = setTimeout(attachRightClickListener, 1000);

    return () => {
      clearTimeout(timer);
      attachRightClickListener();
    };
  }, []);

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
        console.log('set this scene: ', newScene);
        setCurrentScene(newScene);
    }
  };

  const handleAddSpot = () => {
    setShowModal(false);
    console.log('Añadir Spot');
  };

  const handleAddObra = () => {
    setShowModal(false);
    console.log('Añadir Obra');
  };

  return (
    <div className='panellumContainer'>
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
      {showModal && (
        <div className="contextMenu" style={{ top: modalPosition.y, left: modalPosition.x }}>
          <button onClick={handleAddSpot}>Añadir Spot</button>
          <button onClick={handleAddObra}>Añadir Obra</button>
        </div>
      )}
      <button onClick={onSave}>Save</button>
    </div>
  );
};

export default PanoramaViewer;
