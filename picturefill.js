/*! Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with span elements). Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2 */
/*! Amended to use a class name for the select, Requires getElementsByClassName or querySelectorAll */
/*! Includes elements of PicturePolyfill - Author: Andrea Verlicchi | License: MIT/GPLv2 */


(function( w ){

	// Enable strict mode
	"use strict";

	var hasMatchMedia, pixelRatio;

	function getPictures (context) {
		var className = "picture-element",
			ps = [];

		if (context.getElementsByClassName) {
			ps = context.getElementsByClassName(className);
		}
		else if (context.querySelectorAll) {
			ps = context.querySelectorAll('.' + className);
		}
		return ps;
	}

	function getImageSrc (elem) {
		var attrValue = elem.getAttribute( "data-srcset" ),
			srcset, matchedSrc;

		//if we've a srcset then parse this
		if (attrValue) {
			srcset = getSrcsetHash(attrValue);
			matchedSrc = srcset ? getSrcFromSrcsetArray(srcset, pixelRatio) : false;
			if (matchedSrc) {
				return matchedSrc;
			}
		}
		//otherwise return the src attr
		return elem.getAttribute( "data-src" );
	}

	/**
	 * Returns a hash density > sourceSet
	 * @param {string} srcsetAttribute
	 * @returns {object}
	 * @author PicturePolyfill
	 */
	function getSrcsetHash(srcsetAttribute) {
		var srcSetElement,
			source,
			density,
			hash = {
				count : 0
			},
			srcSetElements = srcsetAttribute.split(',');

		for (var i=0, len=srcSetElements.length; i<len; i+=1) {
			srcSetElement = srcSetElements[i].trim().split(' ');
			density = srcSetElement[1] ? srcSetElement[1].trim() : "1x";
			source = srcSetElement[0].trim();
			hash[density] = source;
		}
		return hash;
	}
	/**
	 * Returns the proper src from the srcSet property
	 * Get the first valid element from passed position to the left
	 * @param {Array} srcsetArray
	 * @param {int} position
	 * @returns {string}
	 * @author PicturePolyfill
	 */
	function getSrcFromSrcsetArray(srcsetArray, position) {
		var ret;
		do {
			ret = srcsetArray[position+'x'];
			position-=1;
		}
		while (ret===undefined && position>0);
		return ret;
	}

	/* Picturefill */
	w.picturefill = function() {
		var ps = getPictures(w.document);

		hasMatchMedia = (w.matchMedia && true);
		pixelRatio = (w.devicePixelRatio) ? Math.ceil(w.devicePixelRatio) : 1;

		// Loop the pictures, assumes all found elements are to be parsed
		for( var i = 0, il = ps.length; i < il; i++ ){

			var sources = ps[ i ].getElementsByTagName( "span" ),
				matches = [];

			// See if which sources match
			for( var j = 0, jl = sources.length; j < jl; j++ ){
				var media = sources[ j ].getAttribute( "data-media" );
				// if there's no media specified, OR w.matchMedia is supported 
				if( !media || ( hasMatchMedia && w.matchMedia( media ).matches ) ){
					matches.push( sources[ j ] );
				}
			}

			// Find any existing img element in the picture element
			var picImg = ps[ i ].getElementsByTagName( "img" )[ 0 ];

			if( matches.length ){
				var matchedEl = matches.pop();
				if( !picImg || picImg.parentNode.nodeName === "NOSCRIPT" ){
					picImg = w.document.createElement( "img" );
					picImg.alt = ps[ i ].getAttribute( "data-alt" );
				}
				else if( matchedEl === picImg.parentNode ){
					// Skip further actions if the correct image is already in place
					continue;
				}

				picImg.src = getImageSrc(matchedEl);
				matchedEl.appendChild( picImg );
				picImg.removeAttribute("width");
				picImg.removeAttribute("height");
			}
			else if( picImg ){
				picImg.parentNode.removeChild( picImg );
			}
		}
	};

	// Run on resize and domready (w.load as a fallback)
	if( w.addEventListener ){
		w.addEventListener( "resize", w.picturefill, false );
		w.addEventListener( "DOMContentLoaded", function(){
			w.picturefill();
			// Run once only
			w.removeEventListener( "load", w.picturefill, false );
		}, false );
		w.addEventListener( "load", w.picturefill, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onload", w.picturefill );
	}

}( this ));
