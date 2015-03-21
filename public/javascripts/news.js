get(window.location.origin + '/api/news/get', function(response) {
    var news = JSON.parse(response),
        newsElement = document.getElementsByClassName('news')[0],
        loadingElement = document.getElementById('loading');
    for(var i = 0; i < news.length; i++) {
        var article = news[i],
        articleDiv = document.createElement('div'),
        dateDiv = document.createElement('div'),
        dateIcon = document.createElement('i'),
        dateText = document.createTextNode(article.date),
        titleDiv = document.createElement('div'),
        titleText = document.createTextNode(article.title),
        descDiv = document.createElement('div'),
        descContainer = document.createElement('div'),
        linkDiv = document.createElement('div'),
        linkA = document.createElement('a'),
        linkText = document.createTextNode('Read More'),
        linkIcon = document.createElement('i');

        linkIcon.className = 'icon-link-ext';
        linkDiv.className = 'link';
        descContainer.className = 'description-container';
        descDiv.className = 'description';
        titleDiv.className = 'title';
        dateDiv.className = 'date';
        dateIcon.className = 'icon-clock';
        articleDiv.className = 'article';

        linkA.href = article.link;
        linkA.appendChild(linkText);
        linkA.appendChild(linkIcon);
        linkDiv.appendChild(linkA);

        descContainer.innerHTML = article.description;
        descDiv.appendChild(descContainer);

        titleDiv.appendChild(titleText);

        dateDiv.appendChild(dateIcon);
        dateDiv.appendChild(dateText);

        articleDiv.appendChild(dateDiv);
        articleDiv.appendChild(titleDiv);
        articleDiv.appendChild(descDiv);
        articleDiv.appendChild(linkDiv);
        
        if((typeof(loadingElement) !== 'undefined') && (i == 0)) {
            newsElement.removeChild(loadingElement);
        }
        newsElement.appendChild(articleDiv);
    }
});