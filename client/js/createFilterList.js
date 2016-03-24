'use strict';

(function(global){

    var checkIcon = function(node, toCheck){ // 0: unchecked, 1: partialChecked, 2: checked

        var icon = node.childNodes[0]; // checked <img>
        var states = ['unchecked', 'partialChecked', 'checked'];

        var current = -1;
        if(icon.classList.contains('unchecked')) current = 1;
        else if(icon.classList.contains('partialChecked')) current = 1;
        else if(icon.classList.contains('checked')) current = 2;

        for(var i=0; i<states.length; ++i){
            if(i===toCheck && current !== toCheck){
                icon.classList.add(states[i]);   
            }
            else if(i!==toCheck) icon.classList.remove(states[i]);   
        }
    }
    
    var checkTree = function(e){

        var node = e.currentTarget.parentNode;
        var checked =   e.currentTarget.classList.contains('unchecked') ||
                        e.currentTarget.classList.contains('partialChecked');

        var isParent = node.classList.contains('parent');
        checkIcon(node,checked?2:0);

        if(isParent === true)
        {
            var child = node.nextSibling;
            while(child != null && child.classList.contains('child')){

                checkIcon(child,checked?2:0);
                child = child.nextSibling;
            }
        }
        else{

            var parent = node.previousSibling;
            while(parent != null && !parent.classList.contains('parent')){
                parent = parent.previousSibling;
            }
            var child = parent.nextSibling;
            var nbChildren = 0;
            var cpt = 0;
            while(child != null && child.classList.contains('child')){
                ++nbChildren;
                var iconChild = child.childNodes[0];
                if(iconChild.classList.contains('checked')) ++cpt;
                child = child.nextSibling;
            }
            if(cpt===0) checkIcon(parent, 0);
            else if(cpt===nbChildren) checkIcon(parent,2);
            else checkIcon(parent,1);
        }

        refreshMap();
    }

    var expandTree = function(e){

        var node = e.currentTarget.parentNode;
        var expanded = e.currentTarget.classList.contains('expanded');

        var icon = node.childNodes[node.childNodes.length-1];
        icon.classList.remove(expanded ? 'expanded' : 'collapsed'); 
        icon.classList.add(expanded ? 'collapsed' : 'expanded'); 

        var isParent = node.classList.contains('parent');
        if(isParent === false) return;

        var child = node.nextSibling;
        while(child != null && child.classList.contains('child')){

            child.classList.remove(expanded ? 'li-displayed' : 'li-hidden'); 
            child.classList.add(expanded ? 'li-hidden' : 'li-displayed'); 
            child = child.nextSibling;
        }
    }

    global.createFilterList = function(categories){
        
        var ul = document.createElement('ul');
        
        categories.forEach(function(category, index){
            
            var li = document.createElement('li');
            li.classList.add('parent');

            var checkbox = document.createElement('div');
            checkbox.classList.add('checked');

            var color = document.createElement('span');
            color.classList.add('color');
            color.style.backgroundColor = category.color;

            var text = document.createElement('span');
            text.classList.add('text');
            text.textContent = category.name;

            var expand = document.createElement('div');
            expand.classList.add('collapsed');

            li.appendChild(checkbox);
            li.appendChild(color);
            li.appendChild(text);
            li.appendChild(expand);
            ul.appendChild(li);

            checkbox.addEventListener('click', checkTree);
            expand.addEventListener('click', expandTree);

            category.objects.forEach(function(object){

                li = document.createElement('li');
                li.classList.add('child');
                li.classList.add('li-hidden');

                checkbox = document.createElement('div');
                checkbox.classList.add('checked');
                checkbox.style.marginLeft = '15px';

                var color = document.createElement('span');
                color.classList.add('color');
                color.style.backgroundColor = category.color;

                var text = document.createElement('span');
                text.classList.add('text');
                text.textContent = object;

                li.appendChild(checkbox);
                li.appendChild(color);
                li.appendChild(text);
                ul.appendChild(li);

                checkbox.addEventListener('click', checkTree);
            });
        });
        
        document.querySelector('#filters').appendChild(ul);
    };

})(this);
