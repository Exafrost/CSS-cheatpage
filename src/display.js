import { valid_domain, absolute_path } from "./github.js";

document.addEventListener("DOMContentLoaded", () => {
    window.display = display;  // Assign `display` to `window` after DOM loads
});

async function display(ref) { //the ref does not depend on local/prod address
    ref = absolute_path() + ref;
    let json;
    try {
        const response = await fetch(ref);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        json = await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

    // Set the element to display in display.html
    if (json) {
        localStorage.setItem("element_to_display", json.display_element);
        let text = parseHTML(json.html);
        localStorage.setItem("html_content", text);
        let text_json = parseConfig(json.config);
        localStorage.setItem("config_content", text_json);
    }

    console.log(valid_domain()); // Call `valid_domain` from `github.js`

    // Use new URL method to create a URL to navigate
    const new_url = new URL("src/display.html", valid_domain());
    window.location.assign(new_url);
}


function parseConfig(json){
    //json is of shape " theme :{ extend : { [data] } ,} "
    let indent_text_increment = "&nbsp;&nbsp;&nbsp;";
    let indent_text = ""
    let indent = 0;

    const q = new Queue;

    let final_text = "<span><span class=\"text-red-400\">module.exports</span> = {<br>";
    if (json.theme) { //if theme exists
        indent++;
        indent_text += indent_text_increment;
        final_text += indent_text + "<span class=\"text-red-400\">theme</span> : {<br>";

        if (json.theme.extend) { //if extend exists
            indent++;
            indent_text += indent_text_increment;
            final_text += indent_text + "<span class=\"text-red-400\">extend</span> : {<br>"

            if (json.theme.extend.keyframes){
                indent++;
                indent_text += indent_text_increment;
                final_text += indent_text + "<span class=\"text-red-400\">keyframes</span> : {<br>"

                final_text += parseToText(json.theme.extend.keyframes, indent, indent_text, indent_text_increment);

                final_text += indent_text + "},<br>"
                indent--;
                indent_text = "";
                for (let i=0;i<indent;i++){
                    indent_text += indent_text_increment;
                }
            }
            if (json.theme.extend.animation){
                indent++;
                indent_text += indent_text_increment;
                final_text += indent_text + "<span class=\"text-red-400\">animation</span> : {<br>"

                final_text += parseToText(json.theme.extend.animation, indent, indent_text, indent_text_increment);

                final_text += indent_text + "},<br>"
                indent--;
                indent_text = "";
                for (let i=0;i<indent;i++){
                    indent_text += indent_text_increment;
                }
            }
            if (json.theme.extend.transitionProperty){
                indent++;
                indent_text += indent_text_increment;
                final_text += indent_text + "<span class=\"text-red-400\">transitionProperty</span> : {<br>"

                final_text += parseToText(json.theme.extend.transitionProperty, indent, indent_text, indent_text_increment);

                final_text += indent_text + "},<br>"
                indent--;
                indent_text = "";
                for (let i=0;i<indent;i++){
                    indent_text += indent_text_increment;
                }
            }
            

            final_text += indent_text + "},<br>"
            indent--;
            indent_text = "";
            for (let i=0;i<indent;i++){
                indent_text += indent_text_increment;
            }
        }


        final_text += indent_text + "},<br>"
        indent--;
        indent_text = "";
    }
    final_text += indent_text + "}</span>"
    return final_text;
}

function parseToText(input_text, indent, indent_text, indent_text_increment){
    const q = new Queue;
    let previous = "";
    let text = "";
    let final_text = "";
    for (const el of input_text){
        if (previous == "/"){
            q.enqueue(text);
            q.enqueue(previous + el);
            previous = ""
            text = "";
        }
        else {
            text += previous;
            previous = el;
        }
    }
    q.enqueue(text);

    while (q.size !=0) {
        let current = q.dequeue();
        if (current === "") {continue;}
        // console.log(current);
        if (current == "/n") {
            final_text += "<br>"
        }
        else if (current == "/t") {
            indent++;
            indent_text += indent_text_increment;
        }
        else if (current == "/b") {
            indent--;
            indent_text = ""
            for (let i=0;i<indent;i++){
                indent_text += indent_text_increment;
            }
            final_text += "<br>"
        }
        else {
            final_text += indent_text + current;
        }
        
    }
    return final_text;
}

function parseHTML(text){
    const q = new Queue;
    let current = "";
    for (const el of text){
        if (el == ' ') {
            q.enqueue(current);
            current = "";
        }
        else if (el == '<' || el == '>' || el == '"'){
            q.enqueue(current);
            q.enqueue(el);
            current = "";
        }
        else {
            current = current.concat(el);
        }
    }

    const NO = 0; const KEYWORD = 1; const REST = 2;
    let inside_key_word = NO;
    let inside_quote = false;
    let final_text = "";
    let text_to_add = "";
    let indent = 0; // nb of indentations
    let indent_text = "";
    let indent_text_increment = "&nbsp;&nbsp;&nbsp;";
    while (q.size != 0) {
        let current = q.dequeue();
        if (current === "") {continue;} //skip the loop if the current value is empty
        if (current == "<") { //inside the definition of a key word
            inside_key_word = KEYWORD;
            continue;
        } 
        else if (current == ">") { //end of the definition of a key word
            inside_key_word = NO;
            continue;
        }
        else if (current == "\"") {//beginning or end of a class=""
            if (inside_quote) {
                text_to_add = "\"</span>></span><br>";
                indent++;
                indent_text += indent_text_increment;
            }
            else {text_to_add = "<span class=\"text-green-400\">\"";}
            inside_quote = !inside_quote;
        } 
        else { //generic case
            switch (inside_key_word){
                case KEYWORD:
                    if (current === "/div" || current === "/button" || current === "/span" ) {
                        indent--;
                        indent_text = "";
                        for (let i=0;i<indent;i++){
                            indent_text += indent_text_increment;
                        }
                        inside_key_word = NO;
                        text_to_add ="<br>" + indent_text + "<span><<span class=\"text-red-400\">" + current + "</span>></span>";
                    }
                    else {
                        text_to_add ="<br>" + indent_text + "<span><<span class=\"text-red-400\">" + current + "</span>";
                        inside_key_word = REST;
                    }
                    break;
                case REST:
                    text_to_add = "<span> " + current + "</span>";
                    break;

                default:
                    text_to_add = indent_text + "<span>" + current + " </span>";
                    break;
            }
        } 

        final_text += text_to_add;
    }
    return final_text;
}


// We create a class for each node within the queue
class Node {
    // Each node has two properties, its value and a pointer that indicates the node that follows
    constructor(value){
        this.value = value
        this.next = null
    }
}

// We create a class for the queue
class Queue {
    // The queue has three properties, the first node, the last node and the queue size
    constructor(){
        this.first = null
        this.last = null
        this.size = 0
    }
    // The enqueue method receives a value and adds it to the "end" of the queue
    enqueue(val){
        var newNode = new Node(val)
        if(!this.first){
            this.first = newNode
            this.last = newNode
        } else {
            this.last.next = newNode
            this.last = newNode
        }
        return ++this.size
    }
    // The dequeue method eliminates the element at the "beginning" of the queue and returns its value
    dequeue(){
        if(!this.first) return null

        var temp = this.first
        if(this.first === this.last) {
            this.last = null
        }
        this.first = this.first.next
        this.size--
        return temp.value
    }
}