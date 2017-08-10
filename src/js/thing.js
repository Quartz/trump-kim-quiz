//
// The template doc is at:
// https://docs.google.com/document/d/1Mlz37qMLiZsxB-JIxv9R9b8QLnN921ltXoDpeHm5Le0/edit?usp=sharing
//
// See also thing.jade
//

var fm = require('./fm');
var features = require('./detectFeatures')();
var utils = require('./utils');
var offset = require('document-offset');

var d3 = Object.assign({},
	require("d3-selection"),
	require("d3-request"),
	require("d3-scale"),
	require("d3-axis"),
	require("d3-shape"),
	require("d3-array"),
	require("d3-format"),
	require("d3-transition")
);

//
// This message will show up as the tweet and fb headline as
// I got X out of Y! resultShareMessage
//

var quiz;
var isCorrect;
var isIncorrect;
var meta;
var correctResponse;
var incorrectResponse;
var resultShareMessage;
var score = 0;
var answerCount = 0;

function init () {
	d3.json("assets/content.json",function(error,data){
		quiz = data.quiz;
		isCorrect = data.isCorrect;
		isIncorrect = data.isIncorrect;
		meta = data.meta[0];

		resultShareMessage = meta.desc;

		d3.selectAll(".quiz .response").on("click",function(){
			// get question index
			var index = d3.select(this.parentNode.parentNode).attr("id").substr(1);

			var answered = d3.selectAll(".r"+index+".response-correct");
			console.log(answered.size());

			if (answered.size()) {
				return;
			}

			// count answer in case user sneakily answers out of order
			answerCount += 1;

			// did user choose wisely?
			var isChoiceCorrect = d3.select(this).classed("is-correct");

			// update score
			score += (isChoiceCorrect) ? 1 : 0;

			// choose correct and incorrect responses for this question
			correctResponse = (isCorrect.length > 1) ? isCorrect[Math.floor(Math.random()*((isCorrect.length-1)-0+1)+0)] : isCorrect[0];
			incorrectResponse = (isIncorrect.length > 1) ? isIncorrect[Math.floor(Math.random()*((isIncorrect.length-1)-0+1)+0)] : isIncorrect[0];

			// setup feedback span
			var feedback = (isChoiceCorrect) ? "<span class='text-correct'>"+correctResponse+"</span> " : "<span class='text-incorrect'>"+incorrectResponse+"</span> ";

			// append feedback
			d3.select("#f"+index+" .response .correct-incorrect").html(feedback);

			// append neutral response
			d3.select("#f"+index+" .response").append("span").html(quiz[index].response);

			// show feedback for this question
			d3.select("#f"+index)
				.style("display","block")
				.transition().duration(200)
					.style("opacity",1);

			// turn off pointer events for this question
			d3.selectAll(".r"+index).style("pointer-events","none");

			// highlight correct and incorrect questions appropriately
			d3.selectAll(".r"+index+".is-correct")
				.classed("response-correct",true);

			d3.selectAll(".r"+index+".is-incorrect")
				.classed("response-incorrect",true);

			// scroll so this question is top
			fm.scrollToPosition(offset(document.getElementById("q"+index)).top, 500)


			// if the quiz is finished, show results
			if (answerCount == quiz.length) {
		    var resultsDiv = d3.select("#results");


		    // append score and feedback
		    resultsDiv.append("div")
		      .attr("id","overall-score")
		      .html("You answered "+score+" out of "+quiz.length+" questions correctly.");

		    resultsDiv.append("div")
		      .attr("id","overall-feedback")
		      .html(meta.overallFeedback+"<p>Share your results:</p>");


		    // append quiz source if exists
		    if (meta.source && meta.sourceURL) {
			    resultsDiv.append("div")
			      .attr("class","sources")
			      .html("Source: <a href='"+meta.sourceURL+"'>"+meta.source+"</a>");
		    }

		    // append share button stuff
		    var shareButtonsDiv = resultsDiv.append("div")
		      .attr("id","overall-share-buttons");

		    var fButton = shareButtonsDiv.append("a").attr("id","a-fb-share").attr("target","_blank")
		      .append("img")
		      .attr("class","share-buttons")
		      .attr("id","facebook-icon")
		      .attr("src","assets/facebook.gif");

		    var tButton = shareButtonsDiv.append("a").attr("id","a-t-share").attr("target","_blank")
		      .append("img")
		      .attr("class","share-buttons")
		      .attr("id","twitter-icon")
		      .attr("src","assets/twitter.png");

		    var tweetParams = '&related=qz,quartzthings';

		    var fbParams = {
		      base_url: 'https://www.facebook.com/dialog/feed?',
		      app_id: '676492505769612',
		      link: meta.qzLink,
		      name: 'I got '+score+' out of '+quiz.length+'! '+resultShareMessage,
		      picture: meta.image,
		      caption: 'qz.com',
		      description: meta.desc,
		      message: '',
		      redirect_uri: 'http://qz.com'
		    };

		    var tweetUrl = [
		      'https://twitter.com/intent/tweet?',
		      'url=' + meta.qzLink,
		      '&text=I got '+score+' out of '+quiz.length+'! '+resultShareMessage,
		      tweetParams
		    ].map(encodeURI).join('');

		    var fbUrl = [
		      fbParams.base_url,
		      'app_id=' + fbParams.app_id,
		      '&name=' + fbParams.name,
		      '&link=' + fbParams.link,
		      '&picture=' + fbParams.picture,
		      '&caption=' + fbParams.caption,
		      '&description=' + fbParams.description,
		      '&message=' + fbParams.message,
		      '&redirect_uri=' + fbParams.redirect_uri
		    ].map(encodeURI).join('');

		    d3.select("#a-t-share").attr("href",tweetUrl);
		    d3.select("#a-fb-share").attr("href",fbUrl);

			}

			fm.resize();
		});

	});

	fm.resize();

	window.addEventListener("resize", utils.throttle(resize, 250), true);

}

function setup () {
// setup the thing, insert DOM elements, bind data, etc

	//now that everything is setup, update
	update()
}

function update () {
// update the thing, position, size, and style DOM elemements

}

function resize() {
// on resize, update save dimensional values and update.

	update()
	fm.resize()
}

document.addEventListener("DOMContentLoaded", function() {
	init();
});
