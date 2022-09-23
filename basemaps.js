var map;
require([
    'esri/map', 'esri/basemaps', 'esri/Credential', 'esri/dijit/BasemapGallery', 'esri/dijit/BasemapLayer', 'esri/dijit/Basemap',
    'dojo/parser', 'esri/arcgis/utils',

    'dijit/layout/BorderContainer', 'dijit/layout/ContentPane', 'dijit/TitlePane',
    'dojo/domReady!'
], function (
    Map, esriBasemaps, Credential, BasemapGallery, BasemapLayer, Basemap, parser, arcgisUtils
) {
    parser.parse();

    loadMap = function (token) {
        var creds = new Credential();
        creds.server = 'https://basemaps-api.arcgis.com';
        creds.token = token;
        creds.expires = 7258050000000;

        creds.on('token-change', (msg) => console.log('Credential tokens changed ', msg));
        creds.on('destroy', (msg) => console.log('Credential destroyed ', msg));

        var streetsLayer = new BasemapLayer({
            styleUrl: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Streets?type=style&token=${token}`,
            type: 'VectorTileLayer',
            credential: creds
        });

        var navLayer = new BasemapLayer({
            styleUrl: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Navigation?type=style&token=${token}`,
            type: 'VectorTileLayer',
            credential: creds
        });

        var navBasemap = new Basemap({
            id: 'platformNavBasemap',
            layers: [navLayer],
            title: 'Navigation',
            credential: creds

        })

        var streetsBasemap = new Basemap({
            id: 'platformStreetsBasemap',
            layers: [streetsLayer],
            title: 'Platform Streets',
            credential: creds
        });

        esriBasemaps.platformStreets = streetsBasemap;

        // Initial load gets vector tiles from ArcGIS online, not platform so you don't get an immediate prompt for credentials
        map = new Map('map', {
            basemap: 'streets-vector',
            center: [-105.255, 40.022],
            zoom: 13,
            credential: creds
        });

        var basemapGallery = new BasemapGallery({
            basemaps: [streetsBasemap, navBasemap],
            showArcGISBasemaps: false,
            map: map
        }, 'basemapGallery');
        basemapGallery.startup();

        basemapGallery.on('error', (msg) => console.log('basemap gallery error:  ', msg));
    };

    fetch('token.json')
        .then((response) => response.json())
        .then((data) => loadMap(data.token));


});
