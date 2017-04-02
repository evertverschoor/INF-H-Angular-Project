# INF-H-Angular-Project
Individueel AngularJS project voor INF-H Zoetermeer.


## How-To?
- ```node run.js``` om de server te starten.
- In run.js staat de hostname default op ```null```, dit is localhost, default port is 80.
- E2E en Unit Tests staan in de directory /test.
- Op Unix en je krijgt ```Not found```? Dan moet in /server/server.js de regel ```152: var path = this.goBackOneDir(__dirname) + cleanRequest;``` vervangen worden door ```var path = "." + this.goBackOneDir(__dirname) + cleanRequest;``` omdat de applicatie op een Windows machine ontwikkeld is. Dit stopt een ```.``` voor alle paths zodat Unix in de current directory begint met zoeken.

## Live demo?
- via [TinyURL](http://tinyurl.com/AngularAppEvert) of het [IP van m'n Pi](http://84.85.98.90/), zolang deze draait.