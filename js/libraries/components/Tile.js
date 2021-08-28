import { MathUtil } from "../MathUtil.js"

export let Tile = {
	width: 45,
	height: 45,
	min: 45,
	max: 100,
	update(canvasBounds) {
		Tile.height = Tile.width = Math.min(MathUtil.clamp(canvasBounds.width / 8, Tile.min, Tile.max), MathUtil.clamp(canvasBounds.height / 12, Tile.min, Tile.max))
	}
}