"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSnowflakeBundle = void 0;
let statData = {};
function statField(key, type, value) {
    let info = statData[key];
    if (info == null) {
        statData[key] = info = [type, []];
    }
    let list = info[1];
    for (let i = 0, length = list.length; i < length; ++i) {
        let tuple = list[i];
        if (tuple[0] == value) {
            tuple[1] += 1;
            return;
        }
    }
    list.push([value, 1]);
}
function statArrayField(key, value) {
    let info = statData[key];
    if (info == null) {
        statData[key] = info = ["array", []];
    }
    let list = info[1];
    for (let i = 0, length = list.length; i < length; ++i) {
        let tuple = list[i];
        if (tuple[0] == value) {
            tuple[1] += 1;
            return;
        }
        else {
            let array = tuple[0];
            if (array.length == value.length) {
                let all = true;
                for (let j = 0, size = value.length; j < size; ++j) {
                    if (array[j] != value[j]) {
                        all = false;
                        break;
                    }
                }
                if (all) {
                    tuple[1] += 1;
                    return;
                }
            }
        }
    }
    list.push([value, 1]);
}
function statObjectArrayField(key, type, value, fields) {
    let info = statData[key];
    if (info == null) {
        statData[key] = info = [`array ${type}`, []];
    }
    let list = info[1];
    for (let i = 0, length = list.length; i < length; ++i) {
        let tuple = list[i];
        if (tuple[0] == value) {
            tuple[1] += 1;
            return;
        }
        else {
            let array = tuple[0];
            if (array.length == value.length) {
                let all = true;
                for (let j = 0, size = value.length; j < size; ++j) {
                    for (let name of fields) {
                        if (array[j][name] != value[j][name]) {
                            all = false;
                            break;
                        }
                    }
                    if (!all) {
                        break;
                    }
                }
                if (all) {
                    tuple[1] += 1;
                    return;
                }
            }
        }
    }
    list.push([value, 1]);
}
function statSnowflakeBundle(bundle, name) {
    for (let key in bundle) {
        let value = bundle[key];
        switch (typeof value) {
            case "number":
            case "string":
            case "boolean": {
                statField(`${name}.${key}`, typeof value, value);
                break;
            }
            case "object": {
                if (value instanceof Array) {
                    statArrayField(`${name}.${key}`, value);
                }
                else {
                    switch (key) {
                        case "startLifetimeGradient":
                        case "startLifetimeGradientMin":
                        case "startLifetimeGradientMax": {
                            statArrayField(`${name}.${key}.startLifetimes`, value.startLifetimes);
                            break;
                        }
                        case "emission": {
                            statField(`${name}.${key}.enable`, typeof value.enable, value.enable);
                            statField(`${name}.${key}.emissionRate`, typeof value.emissionRate, value.emissionRate);
                            statField(`${name}.${key}.emissionRateTip`, typeof value.emissionRateTip, value.emissionRateTip);
                            statObjectArrayField(`${name}.${key}.bursts`, "Burst", value.bursts, ["time", "min", "max"]);
                            break;
                        }
                        case "shape": {
                            statSnowflakeBundle(value, `${name}.${key}`);
                            break;
                        }
                        case "colorOverLifetime": {
                            statField(`${name}.${key}.enable`, typeof value.enable, value.enable);
                            statSnowflakeBundle(value.color, `${name}.${key}.color`);
                            break;
                        }
                        case "sizeOverLifetime": {
                            statField(`${name}.${key}.enable`, typeof value.enable, value.enable);
                            statSnowflakeBundle(value.size, `${name}.${key}.size`);
                            break;
                        }
                        case "textureSheetAnimation": {
                            statSnowflakeBundle(value, `${name}.${key}`);
                            break;
                        }
                        case "rotationOverLifetime": {
                            statField(`${name}.${key}.enable`, typeof value.enable, value.enable);
                            statSnowflakeBundle(value.angularVelocity, `${name}.${key}.angularVelocity`);
                            break;
                        }
                        case "velocityOverLifetime": {
                            statField(`${name}.${key}.enable`, typeof value.enable, value.enable);
                            statField(`${name}.${key}.space`, typeof value.enable, value.space);
                            statSnowflakeBundle(value.velocity, `${name}.${key}.velocity`);
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    for (let key in statData) {
        let info = statData[key];
        let list = info[1];
        list.sort((a, b) => {
            return a[1] > b[1] ? -1 : 1;
        });
    }
}
function tryClearArrayProp(props, key, value) {
    if (props[key]) {
        let array = props[key];
        if (array.length == value.length) {
            let all = true;
            for (let j = 0, size = value.length; j < size; ++j) {
                if (array[j] != value[j]) {
                    all = false;
                }
            }
            if (all) {
                delete props[key];
            }
        }
    }
}
function tryClearProp(props, key, value) {
    if (props[key] != undefined && props[key] == value) {
        delete props[key];
    }
}
function tryClearStartLifetimeGradient(props, key) {
    if (props[key] != undefined && props[key].startLifetimes.length == 0) {
        delete props[key];
    }
}
function tryClearEmission(props, key) {
    let emission = props[key];
    if (emission != undefined) {
        tryClearProp(emission, "enable", true);
        tryClearProp(emission, "emissionRate", 0);
        tryClearProp(emission, "emissionRateTip", "Time");
        tryClearArrayProp(emission, "bursts", []);
    }
}
function tryClearShape(props, key) {
    let obj = props[key];
    if (obj != undefined) {
        let fields = [
            ["enable", true],
            ["shapeType", 2],
            ["sphereRadius", 1],
            ["sphereEmitFromShell", false],
            ["sphereRandomDirection", 0],
            ["hemiSphereRadius", 1],
            ["hemiSphereEmitFromShell", false],
            ["hemiSphereRandomDirection", 0],
            ["coneAngle", 0],
            ["coneRadius", 1],
            ["coneLength", 5],
            ["coneEmitType", 0],
            ["coneRandomDirection", 0],
            ["boxX", 1],
            ["boxY", 1],
            ["boxZ", 1],
            ["boxRandomDirection", 0],
            ["circleRadius", 1],
            ["circleArc", 360],
            ["circleEmitFromEdge", false],
            ["circleRandomDirection", 0],
        ];
        for (let field of fields) {
            tryClearProp(obj, field[0], field[1]);
        }
    }
}
function tryClearColorOverLifetime(props, key) {
    let obj = props[key];
    if (obj != undefined) {
        tryClearProp(obj, "enable", true);
        obj = obj["color"];
        if (obj != undefined) {
            tryClearProp(obj, "type", 1);
            tryClearArrayProp(obj, "constant", [0, 0, 0, 0]);
            tryClearArrayProp(obj, "constantMin", [0, 0, 0, 0]);
            tryClearArrayProp(obj, "constantMax", [0, 0, 0, 0]);
        }
    }
}
function tryClearSizeOverLifetime(props, key) {
    let obj = props[key];
    if (obj != undefined) {
        tryClearProp(obj, "enable", true);
        obj = obj["size"];
        if (obj != undefined) {
            tryClearProp(obj, "type", 0);
            tryClearProp(obj, "separateAxes", false);
            tryClearProp(obj, "constantMin", 0);
            tryClearProp(obj, "constantMax", 0);
            tryClearArrayProp(obj, "constantMinSeparate", [0, 0, 0]);
            tryClearArrayProp(obj, "constantMaxSeparate", [0, 0, 0]);
        }
    }
}
function tryClearTextureSheetAnimation(props, key) {
    let obj = props[key];
    if (obj != undefined) {
        tryClearProp(obj, "enable", true);
        tryClearArrayProp(obj, "tiles", [4, 2]);
        tryClearProp(obj, "type", 0);
        tryClearProp(obj, "randomRow", true);
        tryClearProp(obj, "rowIndex", 0);
        tryClearProp(obj, "cycles", 1);
        tryClearProp(obj, "enableUVChannels", 1);
        tryClearProp(obj, "enableUVChannelsTip", "-1");
    }
}
function tryClearRotationOverLifetime(props, key) {
    let obj = props[key];
    if (obj != undefined) {
        tryClearProp(obj, "enable", true);
        obj = obj["angularVelocity"];
        if (obj != undefined) {
            tryClearProp(obj, "type", 0);
            tryClearProp(obj, "separateAxes", false);
            tryClearProp(obj, "constant", 360);
            tryClearProp(obj, "constantMin", 0);
            tryClearProp(obj, "constantMax", 360);
            tryClearArrayProp(obj, "constantMinSeparate", [0, 0, 0]);
            tryClearArrayProp(obj, "constantMaxSeparate", [0, 0, 360]);
        }
    }
}
function tryClearVelocityOverLifetime(props, key) {
    let obj = props[key];
    if (obj != undefined) {
        tryClearProp(obj, "enable", true);
        tryClearProp(obj, "space", 0);
        obj = obj["velocity"];
        if (obj != undefined) {
            tryClearProp(obj, "type", 3);
            tryClearArrayProp(obj, "constant", [0, 0, 0]);
            tryClearArrayProp(obj, "constantMin", [0, 0, 0]);
            tryClearArrayProp(obj, "constantMax", [0, 0, 0]);
        }
    }
}
function formatSnowflakeCustomProps(props) {
    tryClearProp(props, "layer", 0);
    tryClearArrayProp(props, "translate", [0, 0, 0]);
    tryClearArrayProp(props, "rotation", [0, 0, 0, -1]);
    tryClearArrayProp(props, "scale", [1, 1, 1]);
    tryClearProp(props, "isPerformanceMode", true);
    tryClearProp(props, "duration", 1);
    tryClearProp(props, "looping", false);
    tryClearProp(props, "prewarm", false);
    tryClearProp(props, "startDelayType", 0);
    tryClearProp(props, "startDelay", 0);
    tryClearProp(props, "startDelayMin", 0);
    tryClearProp(props, "startDelayMax", 0);
    tryClearProp(props, "startLifetimeType", 0);
    tryClearProp(props, "startLifetimeConstant", 1);
    tryClearProp(props, "startLifetimeConstantMin", 0);
    tryClearProp(props, "startLifetimeConstantMax", 1);
    tryClearStartLifetimeGradient(props, "startLifetimeGradient");
    tryClearStartLifetimeGradient(props, "startLifetimeGradientMin");
    tryClearStartLifetimeGradient(props, "startLifetimeGradientMax");
    tryClearProp(props, "startSpeedType", 0);
    tryClearProp(props, "startSpeedConstant", 0);
    tryClearProp(props, "startSpeedConstantMin", 0);
    tryClearProp(props, "startSpeedConstantMax", 0);
    tryClearProp(props, "threeDStartSize", false);
    tryClearProp(props, "startSizeType", 0);
    tryClearProp(props, "startSizeConstant", 12);
    tryClearProp(props, "startSizeConstantMin", 0);
    tryClearProp(props, "startSizeConstantMax", 12);
    tryClearArrayProp(props, "startSizeConstantSeparate", [12, 1, 1]);
    tryClearArrayProp(props, "startSizeConstantMinSeparate", [0, 0, 0]);
    tryClearArrayProp(props, "startSizeConstantMaxSeparate", [12, 1, 1]);
    tryClearProp(props, "threeDStartRotation", false);
    tryClearProp(props, "startRotationType", 0);
    tryClearProp(props, "startRotationConstant", 0);
    tryClearProp(props, "startRotationConstantMin", 0);
    tryClearProp(props, "startRotationConstantMax", 0);
    tryClearArrayProp(props, "startRotationConstantSeparate", [0, 0, 0]);
    tryClearArrayProp(props, "startRotationConstantMinSeparate", [0, 0, 0]);
    tryClearArrayProp(props, "startRotationConstantMaxSeparate", [0, 0, 0]);
    tryClearProp(props, "randomizeRotationDirection", 0);
    tryClearProp(props, "startColorType", 0);
    tryClearArrayProp(props, "startColorConstant", [1, 1, 1, 1]);
    tryClearArrayProp(props, "startColorConstantMin", [0, 0, 0, 0]);
    tryClearArrayProp(props, "startColorConstantMax", [1, 1, 1, 1]);
    tryClearArrayProp(props, "gravity", [0, -9.81, 0]);
    tryClearProp(props, "gravityModifier", 0);
    tryClearProp(props, "simulationSpace", 1);
    tryClearProp(props, "scaleMode", 1);
    tryClearProp(props, "playOnAwake", true);
    tryClearProp(props, "maxParticles", 1);
    tryClearProp(props, "autoRandomSeed", true);
    tryClearProp(props, "randomSeed", 0);
    tryClearEmission(props, "emission");
    tryClearShape(props, "shape");
    tryClearColorOverLifetime(props, "colorOverLifetime");
    tryClearSizeOverLifetime(props, "sizeOverLifetime");
    tryClearProp(props, "renderMode", 4);
    tryClearProp(props, "stretchedBillboardCameraSpeedScale", 0);
    tryClearProp(props, "stretchedBillboardSpeedScale", 0);
    tryClearProp(props, "stretchedBillboardLengthScale", 2);
    tryClearProp(props, "sortingFudge", 0);
    tryClearTextureSheetAnimation(props, "textureSheetAnimation");
    tryClearRotationOverLifetime(props, "rotationOverLifetime");
    tryClearVelocityOverLifetime(props, "velocityOverLifetime");
}
function formatSnowflakeBundleChild(bundle) {
    if (bundle.type == "MyShuriKenParticle3D") {
        delete bundle.type;
    }
    delete bundle.components;
    delete bundle.props;
    formatSnowflakeCustomProps(bundle.customProps);
    if (bundle.child) {
        if (bundle.child.length > 0) {
            for (let child of bundle.child) {
                formatSnowflakeBundleChild(child);
            }
        }
        else {
            delete bundle.child;
        }
    }
}
function formatSnowflakeBundle(bundle) {
    delete bundle.components;
    delete bundle.props;
    delete bundle.customProps;
    for (let child of bundle.child) {
        statSnowflakeBundle(child.customProps, "SnowflakeBundle");
        formatSnowflakeBundleChild(child);
    }
    return bundle;
}
exports.formatSnowflakeBundle = formatSnowflakeBundle;
//# sourceMappingURL=snowflake_utils.js.map