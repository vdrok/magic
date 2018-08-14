// @flow
//source http://tristen.ca/hcl-picker/#/hlc/5/1/21313E/EFEE69
type scaleType = {
    [maxElements: string]: Array<string>,
}

const SCALE:scaleType = {
    "9": ["#21313E","#214854","#1F6165","#237B71","#389576","#5AAE76","#84C671","#B6DB6B","#EFEE69"],
    "8": ["#21313E","#214C57","#1F6969","#2A8674","#4AA377","#78BF73","#AFD96C","#EFEE69"],
    "7": ["#21313E","#20505A","#20726E","#389576","#67B675","#A5D56D","#EFEE69"],
    "6": ["#21313E","#20575F","#268073","#53A976","#98CF6F","#EFEE69"],
    "5": ["#21313E","#1F6165","#389576","#84C671","#EFEE69"],
    "4": ["#21313E","#20726E","#67B675","#EFEE69"],
    "3": ["#21313E","#389576","#EFEE69"],
    "2": ["#21313E","#EFEE69"],
    "1": ["#EFEE69"]
};

export function getScaleColor(element:number, maxElements:number):string {

    if(element > 9 || element < 1) return "#EFEE69"; //TODO something more clever

    if(maxElements > 9){
        maxElements = 9;
    }

    return SCALE[maxElements.toString()][element - 1];
}

export function getColorScale(maxElements:number): Array<string>{
    return SCALE[maxElements.toString()];
}
