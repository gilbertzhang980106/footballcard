cc.findNode = (name:string,tag:cc.Node)=>{
    if (tag.children.length == 0) {
        return null 
    }
    for (let childernNode of tag.children) {
        if (childernNode.name == name) {
            return childernNode
        } else {
            let node = cc.findNode(name,childernNode)
            if (node) {
                return node
            }
        }
    }
} 