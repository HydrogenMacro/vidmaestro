import Component from "../../component.js";

export default class Operation extends Component {
    args = [];
    errors() {
        return null;
    }
    getBoundingBox() {
        return mergeBoundingBoxes(...this.args.map(component => component.getBoundingBox()));
    }
}