<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { loadMapData } from '@/api/chart.js'; // 确保这是正确的路径
import { cty_color } from '@/assets/js/cty-color.js';

const chartdiv = ref(null);

let root;

onMounted(async () => {
    // 加载地图数据
    const { transformedData: responseData } = await loadMapData();
    // console.log(res.transformedData); // 确认数据加载

    root = am5.Root.new(chartdiv.value);
    root.setThemes([am5themes_Animated.new(root)]);

    const colors = am5.ColorSet.new(root, {});

    const colorLookup = cty_color.reduce((acc, item) => {
        acc[item.id] = item.colorIndex;
        return acc;
    }, {});


    let chart = root.container.children.push(
        am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "rotateY",
            projection: am5map.geoMercator(),
        })
    );



    let backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0,
        strokeOpacity: 0
    });

    backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });


    let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
        })
    );

    polygonSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0.15,
        strokeWidth: 0.5,
        stroke: root.interfaceColors.get("background")
    });
    var circleTemplate = am5.Template.new({
        tooltipText: "{name}: {value}"
    });

    var bubbleSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
            calculateAggregates: true,
            valueField: "value",
            polygonIdField: "id"
        })
    );

    bubbleSeries.bullets.push(function () {
        return am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
                radius: 10,
                templateField: "circleTemplate"
            }, circleTemplate)
        });
    });

    bubbleSeries.set("heatRules", [{
        target: circleTemplate,
        min: 3,
        max: 30,
        key: "radius",
        dataField: "value"
    }]);
    const mapData = responseData.map(item => ({
        ...item,
        latitude: am5geodata_worldLow.features.find(f => f.id === item.id)?.properties.latitude,
        longitude: am5geodata_worldLow.features.find(f => f.id === item.id)?.properties.longitude,
        circleTemplate: {
            fill: colors.getIndex(colorLookup[item.id] || 0)
        }
    }));
    bubbleSeries.data.setAll(mapData);

    let cont = chart.children.push(am5.Container.new(root, {
        layout: root.horizontalLayout,
        x: 20,
        y: 40
    }));

    cont.children.push(am5.Label.new(root, {
        centerY: am5.p50,
        text: "Map"
    }));

    let switchButton = cont.children.push(
        am5.Button.new(root, {
            themeTags: ["switch"],
            centerY: am5.p50,
            icon: am5.Circle.new(root, {
                themeTags: ["icon"]
            })
        })
    );

    switchButton.on("active", function () {
        if (!switchButton.get("active")) {
            chart.set("projection", am5map.geoMercator());
            backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
        } else {
            chart.set("projection", am5map.geoOrthographic());
            backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
        }
    });

    cont.children.push(
        am5.Label.new(root, {
            centerY: am5.p50,
            text: "Globe"
        })
    );

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
});

onBeforeUnmount(() => {
    if (root) {
        root.dispose();
    }
});
</script>

<template>
    <div ref="chartdiv" class="chartdiv"></div>
</template>

<style>
.chartdiv {
    width: 100%;
    height: 500px;
}
</style>
