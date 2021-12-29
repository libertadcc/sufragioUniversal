import Map from 'https://js.arcgis.com/4.22/@arcgis/core/Map.js'
import MapView from "https://js.arcgis.com/4.22/@arcgis/core/views/MapView.js";
import FeatureLayer from "https://js.arcgis.com/4.22/@arcgis/core/layers/FeatureLayer.js";
import Extent from "https://js.arcgis.com/4.22/@arcgis/core/geometry/Extent.js";
import TimeSlider from "https://js.arcgis.com/4.22/@arcgis/core/widgets/TimeSlider.js";
import esriConfig from "https://js.arcgis.com/4.22/@arcgis/core/config.js";

esriConfig.apiKey = "AAPK418e9df5895041d99065bd00d99c72f5NuaBMdnTtUNc0N2zn2CrO9sxJec54XGurgzwhaCeJRDUKa9-DgbLt-HkC529TwMm";

const map = new Map({
    basemap: "arcgis-topographic" // Basemap layer service
});
const renderer = {
    type: 'simple',
    symbol: {
        type: "simple-fill",
        outline: { color: [165, 79, 176, 1] },
        color: [212, 143, 216, 0.45]
    }
};
const suffrageLayer = new FeatureLayer({
    url: 'https://services1.arcgis.com/YFraetVkEAF1lMag/ArcGIS/rest/services/Universal_suffrage/FeatureServer/0',
    renderer: renderer,
    popupTemplate: {
        title: '{ADMIN}',
        content: '{yearSU}' //Date(Year(Now()),0,1)
    }
});
map.add(suffrageLayer);



const globalExtent = new Extent({
    "xmin": -21347430.933634788,
    "ymin": -5841775.269330634,
    "xmax": 16222897.209085055,
    "ymax": 12493327.57948629,
    "spatialReference": {
        "wkid": 102100
    }
});

const view = new MapView({
    map: map,
    extent: globalExtent,
    container: "divMap" // Div element
});

const timeSlider = new TimeSlider({
    container: "timeSlider",
    view: view,
    mode: "cumulative-from-start",
    // timeVisible: true, // show the time stamps on the timeslider
    // fullTimeExtent: {
    //     start: 
    // }
  });

let timeLayerView;
view.whenLayerView(suffrageLayer).then((layerView) => {
    timeLayerView = layerView;
    const fullTimeExtent = suffrageLayer.timeInfo.fullTimeExtent;
    const end = fullTimeExtent.start;
    console.log(
        {
            "fullTimeExtent": fullTimeExtent,
            "end": end,
            "interval": suffrageLayer.timeInfo.interval
        });


    timeSlider.fullTimeExtent = fullTimeExtent;
    timeSlider.timeExtent = {
      start: null,
      end: new Date(1860, 1,1)
    };
    timeSlider.stops = {
    //   interval: suffrageLayer.timeInfo.interval
        interval: {
            value: 1,
            unit: "years"
        }
    };
  });
  
  timeSlider.watch("timeExtent", (value) => {
    // update layer view filter to reflect current timeExtent
    timeLayerView.filter = {
      timeExtent: value
    };
});


//   1906 -2020