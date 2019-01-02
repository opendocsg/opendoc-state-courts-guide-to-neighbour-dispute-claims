var startLunrIndexing = function () {
    return new Promise(function (resolve, reject) {
        console.log("Indexing lunr initialized")
        var request
        if ((typeof window.FileReader) !== 'function') {
            console.log('No filereader api')
            reject('No filereader api')
        }
        request = new XMLHttpRequest()
        request.open('GET', '/assets/siteIndex.json', true)
        request.responseType = 'blob'
        request.onload = function () {
            var fr
            fr = new FileReader()
            fr.onload = function (event) {
                var index, sectionIndex, siteIndex
                siteIndex = JSON.parse(event.target.result)
                sectionIndex = {}
                index = lunr(function () {
                    this.ref('url')
                    this.field('title', {
                        boost: 2
                    })
                    this.field('text')
                    this.metadataWhitelist = ['position']
                    this.pipeline.remove(lunr.stemmer)
                    return siteIndex.forEach((function (_this) {
                        return function (section) {
                            if (section.text.length > 0) {
                                sectionIndex[section.url] = section
                                return _this.add({
                                    'url': section.url,
                                    'title': section.title,
                                    'text': section.text
                                })
                            }
                        }
                    })(this))
                })
                console.log("Indexing lunr done")
                return resolve({
                    index: index.toJSON(),
                    sectionIndex: sectionIndex
                })
            }
            return fr.readAsText(request.response)
        }
        return request.send()
    })
}