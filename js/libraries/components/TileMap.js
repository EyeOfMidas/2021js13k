import { AsyncDataReader } from "../AsyncDataReader.js";
import { SpritesheetAtlas } from "../SpritesheetAtlas.js";
import { Point } from "../spatial/Point.js";

export class TileMap {
    constructor() {
        this.mapData = null
        this.loaded = false
        this.translated = false;
        this.atlases = {}
        this.roomDataFile = "";
    }

    translateV1V2(datain){
        let dataout = datain
        if(datain.version == 1) {
            let tilesArray = []
            datain.spritemap.forEach((sprite, index) => {
                tilesArray[index] = [sprite, datain.tiles[index], []]
            })
            dataout.tiles = tilesArray
            delete dataout.spritemap
            dataout.version = 2
            this.translated = true
        }
        return dataout
    }

    translateV2V3(datain){
        let dataout = datain
        if(datain.version == 2) {
            dataout.spritesheets = [datain.spritesheet]
            let tilesArray = []
            datain.tiles.forEach((tile, index) => {
                let newTile = []
                newTile[0] = [tile[0][0], tile[0][1], 0]
                newTile[1] = tile[1]
                let newDecals = []
                tile[2].forEach((decal) => {
                    newDecals.push([decal[0], decal[1], 0])
                })
                newTile[2] = newDecals
                tilesArray[index] = newTile
            })
            dataout.tiles = tilesArray
            delete dataout.spritesheet
            dataout.version = 3
            this.translated = true
        }
        return dataout
    }

    translateV3V4(datain) {
        let dataout = datain
        if(datain.version == 3) {
            let tilesArray = []
            datain.tiles.forEach((tile, index) => {
                tile[3] = []
                tilesArray[index] = tile
            })
            dataout.tiles = tilesArray
            dataout.version = 4
            this.translated = true
        }
        return dataout
    }

    translateV4V5(datain) {
        let dataout = datain
        if(datain.version == 4) {
            let tilesArray = []
            let mapMin = new Point(datain.bounds[0], datain.bounds[1])
            let mapMax = new Point(datain.bounds[2] - mapMin.x, datain.bounds[3] - mapMin.y)

            let xIndex = mapMin.x
            let yIndex = mapMin.y
            datain.tiles.forEach((tile, index) => {
                let newTile = [[xIndex, yIndex], tile[0], tile[1], tile[2], tile[3]]
                tilesArray[index] = newTile
                xIndex++
                if(xIndex >= mapMax.x) {
                    yIndex++
                    xIndex = mapMin.x
                }
            })
            dataout.tiles = tilesArray
            dataout.version = 5
            this.translated = true
        }
        return dataout
    }

    translateV5V6(datain) {
        let dataout = datain
        if (datain.version == 5) {
            dataout.exits = [datain.start]
            delete dataout.start
            let tilesArray = []
            datain.tiles.forEach((tile, index) => {
                tilesArray[index] = tile
                if (tile[2][1]) {
                    tile[2][1][1] = 0
                }
            })
            dataout.version = 6
            this.translated = true
        }
        return dataout
    }

    translateV6V7(datain) {
        let dataout = datain
        if (datain.version == 6) {
            dataout.owner = "1"
            dataout.writers = []
            dataout.version = 7
            this.translated = true
        }
        return dataout
    }

    async load(filepath) {
        this.roomDataFile = filepath
        this.loaded = false
        try {
            let versioned = await new AsyncDataReader().readJson(filepath)
            if (versioned.responseType && versioned.responseType == 400) {
                //no room found, creating default empty room
                versioned = {
                    "version": 7,
                    "bounds": [0, 0, 4, 4],
                    "tiles": [],
                    "spritesheets": ["./assets/roguelikeSheet_transparent.png"],
                    "exits": [[2, 2]],
                    "owner": "",
                    "writers": []
                }

            }
            versioned = this.translateV1V2(versioned)
            versioned = this.translateV2V3(versioned)
            versioned = this.translateV3V4(versioned)
            versioned = this.translateV4V5(versioned)
            versioned = this.translateV5V6(versioned)
            versioned = this.translateV6V7(versioned)
            this.mapData = versioned
            this.sortTiles(this.mapData)
            //TODO: if logged in, and owner not set, set ownership to current user
            if (this.translated) {
                console.log("converted", JSON.stringify(this.mapData))
            }
            this.atlases = {}
            let atlasLoadPromises = []
            this.mapData.spritesheets.forEach((sheet, index) => {
                let atlas = new SpritesheetAtlas()
                atlasLoadPromises.push(atlas.load(sheet, { width: 16, height: 16, margin: 1 }))
                this.atlases[index] = atlas
            })
            await Promise.all(atlasLoadPromises)
            this.loaded = true
        } catch (e) {
            alert("Something went wrong when trying to load this map");
        }
    }

    async loadFromApi(roomName) {
        let filepath = `./api/room/${roomName}`
        this.roomName = roomName
        return await this.load(filepath)
    }

    reloadAtlas(index) {
        let atlas = new SpritesheetAtlas()
        atlas.load(this.mapData.spritesheets[index], { width: 16, height: 16, margin: 1 })
        this.atlases[index] = atlas
    }

    sortTiles(mapData) {
        mapData.tiles.sort((a, b) => {
            if (a[0][0] == b[0][0]) return a[0][1] - b[0][1]
            return a[0][0] - b[0][0]
        })
    }

    draw(ctx, scaledCanvas) {
        if(!this.loaded) {
            return
        }
        ctx.save();
        ctx.translate(16 * this.mapData.bounds[0], 16 * this.mapData.bounds[1])
        this.mapData.tiles.forEach((tile) => {
            let sprite = tile[1]
            let atlas = this.getAtlas(sprite[2])
            ctx.save();
            ctx.translate(tile[0][0] * 16, tile[0][1] * 16)
            atlas.getDrawableSprite(sprite[0], sprite[1]).draw(ctx, scaledCanvas)
            ctx.restore();
        })
        ctx.restore();
    }

    drawDecals(ctx, scaledCanvas) {
        if(!this.loaded) {
            return
        }
        ctx.save();
        ctx.translate(16 * this.mapData.bounds[0], 16 * this.mapData.bounds[1])
        this.mapData.tiles.forEach((tile, index) => {
            ctx.save();
            ctx.translate(tile[0][0] * 16, tile[0][1] * 16)
            tile[3].forEach((decal) => {
                let decalAtlas = this.getAtlas(decal[2])
                decalAtlas.getDrawableSprite(decal[0], decal[1]).draw(ctx, scaledCanvas)
            })
            ctx.restore();
        })
        ctx.restore();
    }
    drawOverDecals(ctx, scaledCanvas) {
        if(!this.loaded) {
            return
        }
        ctx.save();
        ctx.translate(16 * this.mapData.bounds[0], 16 * this.mapData.bounds[1])
        this.mapData.tiles.forEach((tile, index) => {
            ctx.save();
            ctx.translate(tile[0][0] * 16, tile[0][1] * 16)
            tile[4].forEach((decal) => {
                let decalAtlas = this.getAtlas(decal[2])
                decalAtlas.getDrawableSprite(decal[0], decal[1]).draw(ctx, scaledCanvas)
            })
            ctx.restore();
        })
        ctx.restore();
    }

    drawCollision(ctx, scaledCanvas) {
        if(!this.loaded) {
            return
        }
        ctx.save();
        ctx.translate(16 * this.mapData.bounds[0], 16 * this.mapData.bounds[1])
        this.mapData.tiles.forEach((tile, index) => {
            let collidable = tile[2][0]
            if(collidable == 0) {
                return
            }
            ctx.save();
            ctx.translate(tile[0][0] * 16, tile[0][1] * 16)
            ctx.fillStyle = "rgba(240, 40, 40, 0.5)"
            ctx.beginPath()
            ctx.rect(-8,-8, 16, 16)
            ctx.fill()
            ctx.restore();
        })
        ctx.restore();
    }

    drawDoors(ctx, scaledCanvas) {
        if (!this.loaded) {
            return
        }
        ctx.save();
        ctx.translate(16 * this.mapData.bounds[0], 16 * this.mapData.bounds[1])
        this.mapData.tiles.filter((tile, index) => {
            return tile[2][1]
        }).forEach((tile) => {
            ctx.save();
            ctx.translate(tile[0][0] * 16, tile[0][1] * 16)
            ctx.strokeStyle = "rgba(40, 240, 40, 1.0)"
            ctx.beginPath()
            ctx.rect(-8, -8, 16, 16)
            ctx.stroke()
            ctx.restore();
        })

        this.mapData.exits.forEach((exit, index) => {
            ctx.save();
            ctx.translate(exit[0] * 16, exit[1] * 16)
            ctx.fillStyle = "rgba(240, 240, 40, 1.0)"
            ctx.beginPath()
            ctx.rect(-8, -8, 16, 16)
            ctx.fill()
            ctx.fillStyle = "#000000"
            ctx.font = "14px Arial"
            ctx.textAlign = "center"
            ctx.fillText(`${index}`, 0, 5)
            ctx.restore();
        })
        ctx.restore();
    }

    drawCoords(ctx, scaledCanvas) {
        if(!this.loaded) {
            return
        }
        ctx.save();
        ctx.translate(16 * this.mapData.bounds[0], 16 * this.mapData.bounds[1])
        this.mapData.tiles.forEach((tile, index) => {
            ctx.save();
            ctx.translate(tile[0][0] * 16, tile[0][1] * 16)
            ctx.textAlign = "right"
            ctx.font = "6px Arial"
            ctx.fillStyle =  "rgba(255,255,255,0.4)"
            ctx.fillText(`${tile[0][0]},${tile[0][1]}`, 8, 8)
            ctx.restore();
        })
        ctx.restore();
    }

    drawDecalCoords(ctx, scaledCanvas) {
        if(!this.loaded) {
            return
        }
        ctx.save();
        ctx.translate(16 * this.mapData.bounds[0], 16 * this.mapData.bounds[1])
        this.mapData.tiles.forEach((tile, index) => {
            if(tile[3].length > 0 || tile[4].length > 0) {
                ctx.save();
                ctx.translate(tile[0][0] * 16, tile[0][1] * 16)
                ctx.textAlign = "center"
                ctx.font = "6px Arial"
                ctx.fillStyle =  "rgba(0,0,0,0.5)"
                ctx.fillText(`${tile[0][0]},${tile[0][1]}`, 0, 0)
                ctx.restore();
            }
        })
        ctx.restore();
    }

    getTile(x, y) {
        if(x < this.mapData.bounds[0] ||
            x > this.mapData.bounds[0]+this.mapData.bounds[2] - 1 ||
            y < this.mapData.bounds[1] ||
            y > this.mapData.bounds[1]+this.mapData.bounds[3] - 1) {
            throw Error("Not on map")
        }
        return this.mapData.tiles.find(tile => x == tile[0][0] && y == tile[0][1])
    }

    updateMovement(gridPosition, successFunction) {
        if(!this.loaded) {
            return
        }
        let currentTile = this.getTile(gridPosition.x, gridPosition.y)
        if(!currentTile) {
            return
        }
        let tileData = currentTile[2]
        if(tileData[0] == 1) {
            return
        }

        if(gridPosition.x < this.mapData.bounds[0] ||
            gridPosition.x > this.mapData.bounds[0] + this.mapData.bounds[2] - 1 ||
            gridPosition.y < this.mapData.bounds[1] ||
            gridPosition.y > this.mapData.bounds[1] + this.mapData.bounds[3] - 1 ) {
            return
        }
        if (tileData[1]) {
            let newRoomData = tileData[1][0]
            let newRoomEntrance = tileData[1][1]
            successFunction(gridPosition, this.roomName)
            this.loadFromApi(newRoomData).then(() => {
                let doorData = this.mapData.exits[newRoomEntrance]
                let doorLocation = new Point(doorData[0] + this.mapData.bounds[0], doorData[1] + this.mapData.bounds[1])
                successFunction(doorLocation, this.roomName)
            })
            return
        }
        successFunction(gridPosition, this.roomName)
    }

    getAtlas(index) {
        let atlas = this.atlases[index]
        return atlas
    }
}