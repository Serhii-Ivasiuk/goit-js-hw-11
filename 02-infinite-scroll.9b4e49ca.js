!function(){function e(e){return e&&e.__esModule?e.default:e}var n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},r={},t={},a=n.parcelRequired7c6;null==a&&((a=function(e){if(e in r)return r[e].exports;if(e in t){var n=t[e];delete t[e];var a={id:e,exports:{}};return r[e]=a,n.call(a.exports,a,a.exports),a.exports}var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(e,n){t[e]=n},n.parcelRequired7c6=a);var o=a("bpxeT"),s=a("1t1Wn"),i=a("2TvXO"),c=a("6JpON"),l=a("5IjG7"),u=new(0,a("eIgCF").ImagesService),f={form:document.querySelector("#search-form"),gallery:document.querySelector(".gallery")},p=new IntersectionObserver((function(n,r){var t=e(s)(n,1)[0];t.isIntersecting&&(r.unobserve(t.target),function(){m.apply(this,arguments)}())})),d=null;function g(){return(g=e(o)(e(i).mark((function n(r){var t,a,o;return e(i).wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(r.preventDefault(),b(),u.pageReset(),u.query=r.target.elements.searchQuery.value.trim(),""!==u.query){n.next=8;break}return f.form.reset(),w("info","Please, enter your search request."),n.abrupt("return");case 8:return n.prev=8,n.next=11,u.getImages();case 11:if(t=n.sent,a=t.hits,o=t.totalHits,0!==t.total){n.next=18;break}return w("failure","Sorry, there are no images matching your search query. Please try again."),n.abrupt("return");case 18:w("success","Hooray! We found ".concat(o," images.")),y(a),d=new(e(l))(".gallery a"),h(),n.next=27;break;case 24:n.prev=24,n.t0=n.catch(8),w("failure","Something went wrong... Please try again later.");case 27:case"end":return n.stop()}}),n,null,[[8,24]])})))).apply(this,arguments)}function m(){return(m=e(o)(e(i).mark((function n(){var r,t,a;return e(i).wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u.incrementPage(),e.prev=1,e.next=4,u.getImages();case 4:if(r=e.sent,t=r.hits,a=r.totalHits,y(t),x(),d.refresh(),!(a<u.page*u.perPage)){e.next=14;break}return w("info","We're sorry, but you've reached the end of search results."),v(),e.abrupt("return");case 14:h(),e.next=20;break;case 17:e.prev=17,e.t0=e.catch(1),w("failure","Something went wrong... Please try again later.");case 20:case"end":return e.stop()}}),n,null,[[1,17]])})))).apply(this,arguments)}function h(){var e=document.querySelector(".gallery > a:last-child");e&&p.observe(e)}function y(e){e.map((function(e){var n=e.webformatURL,r=e.largeImageURL,t=e.tags,a=e.likes,o=e.views,s=e.comments,i=e.downloads;f.gallery.insertAdjacentHTML("beforeend",'\n        <a href="'.concat(r,'">\n          <div class="photo-card">\n            <img src="').concat(n,'" alt="').concat(t,'" loading="lazy" />\n            <div class="info">\n              <p class="info-item">\n                <b>Likes</b>\n                ').concat(a,'\n              </p>\n              <p class="info-item">\n                <b>Views</b>\n                ').concat(o,'\n              </p>\n              <p class="info-item">\n                <b>Comments</b>\n                ').concat(s,'\n              </p>\n              <p class="info-item">\n                <b>Downloads</b>\n                ').concat(i,"\n              </p>\n            </div>\n          </div>\n        </a>\n        "))}))}function v(){f.gallery.insertAdjacentHTML("beforeend",'\n    <p class="end-message">\n      The end of search results.\n    </p>\n    ')}function b(){f.gallery.innerHTML=""}function w(n,r){return e(c).Notify[n](r,{position:"center-center",clickToClose:!0})}function x(){var e=f.gallery.firstElementChild.getBoundingClientRect().height;window.scrollBy({top:2*e,behavior:"smooth"})}f.form.addEventListener("submit",(function(e){return g.apply(this,arguments)}))}();
//# sourceMappingURL=02-infinite-scroll.9b4e49ca.js.map