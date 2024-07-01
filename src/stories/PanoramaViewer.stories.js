// src/stories/PanoramaViewer.stories.js
import React from 'react';
import PanoramaViewer from '../components/PanoramaViewer';

const sourceJSON = `{
  "scenes": [
    {
      "id": "museum1",
      "title": "interior 1",
      "image": "02.27.2023_17.57.55.jpg",
      "pitch": 0,
      "yaw": 0,
      "hotSpot": [
        {
          "type": "image-modal",
          "pitch": 0,
          "yaw": 0,
          "imagePath": "/images/image1.jpg",
          "cssClass": "hotSpotElement",
          "data": {
            "title": "El grito",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, quae.",
            "dimension": "20x30"
          }
        },
        {
          "type": "navigation",
          "pitch": 30,
          "yaw": 22,
          "cssClass": "moveScene",
          "scene": "museum2"
        }
      ]
    },
    {
      "id": "museum2",
      "title": "interior 2",
      "image": "02.28.2023_11.09.43.jpg",
      "pitch": 0,
      "yaw": 0,
      "hotSpot": [
        {
            "type": "navigation",
            "pitch": 2,
            "yaw": 1,
            "cssClass": "moveScene",
            "scene": "museum1"
        },
        {
          "type": "navigation",
          "pitch": 12,
          "yaw": 22,
          "cssClass": "moveScene",
          "scene": "museum3"
        }
      ]
    },
    {
      "id": "museum3",
      "title": "interior 3",
      "image": "02.28.2023_11.09.43.jpg",
      "pitch": 0,
      "yaw": 0,
      "hotSpot": [
        {
          "type": "custom",
          "pitch": 0,
          "yaw": 0,
          "nameModel": "boat",
          "cssClass": "hotSpotElement"
        }
      ]
    }
  ]
}`;

export default {
  title: 'Example/PanoramaViewer',
  component: PanoramaViewer,
};

const Template = (args) => <PanoramaViewer {...args} />;

export const DefaultView = Template.bind({});
DefaultView.args = {
  pitch: 0,
  yaw: 0,
  onRelease: (coords) => {
    console.log('Mouse released at coordinates:', coords);
  },
  onSave: () => {
    console.log('Save button clicked');
  },
  source: sourceJSON
};

export const CustomView = Template.bind({});
CustomView.args = {
  pitch: 10,
  yaw: 180,
  hfov: 120,
  onRelease: (coords) => {
    console.log('Mouse released at coordinates:', coords);
  },
  onSave: () => {
    console.log('Save button clicked');
  },
  source: sourceJSON
};
