'use strict';

(function(global){
    global.createFilterList = function(filterValues, onFilterChange){
        var ul = document.createElement('ul');

        filterValues.forEach(function(fv){
            var li = document.createElement('li');

            var color = document.createElement('span');
            color.classList.add('color');
            color.style.backgroundColor = fv.color;

            var text = document.createElement('span');
            text.classList.add('text');
            text.textContent = fv.name;

            li.appendChild(color);
            li.appendChild(text);

            li.addEventListener('click', function(){
                fv.checked = !fv.checked;

                if(fv.checked){
                    li.classList.remove('disabled');
                }
                else{
                    li.classList.add('disabled');
                }
                
                onFilterChange(filterValues); // new filter values are the same object but mutated
            });

            ul.appendChild(li);
        });
        
        return ul;
    };

})(this);
