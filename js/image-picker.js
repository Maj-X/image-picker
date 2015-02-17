var ImagePicker = function(element, options)
{
	var that = this;

	this.globalClass = 'image-picker-element';
	this.boxClass = 'image-picker-box';
	this.selectorClass = 'image-picker-selector';
	this.imageClass = 'image-picker-image';
	this.attrImageSrc = 'data-img-src';
	this.globalId = 'image-picker-' + Math.floor((Math.random() * 10000000) + 1);

	var defaults = {
		selectorHeight: 200,
		selectorWidth:  900,
		imageMaxHeight: 500,
		imageMaxWidth: 500
	}

	this.params = $.extend({}, defaults, options);

	this.imageStyle = 'max-height:' + this.params.imageMaxHeight + 'px; max-width:' + this.params.imageMaxWidth + 'px';

	this.element = element;
	this.element.hide();

	this.images = [];

	this.options = this.element.children('option')

	this.loadImages = function()
	{
		var i = 0;

		this.totalImageWidth = 0;

		this.options.each(function(){
			that.images.push({
				id: $(this).val(),
				src: $(this).attr(that.attrImageSrc)
			});

			var tmpImg = new Image();
			tmpImg.src=that.images[that.images.length - 1].src;
			$(tmpImg).on('load', function(){
				that.totalImageWidth += that.getRealImageWidth(tmpImg.width, tmpImg.height);
				i++;
				if (i >= that.options.length) {
					that.setContent();
				}
			});
		});

		this.currentImage = (0 in this.images) ? this.images[0] : null;
	}

	this.getRealImageWidth = function(imageWidth, imageHeight)
	{
		var maxWidth = imageWidth > this.params.imageMaxWidth ? this.params.imageMaxWidth : imageWidth;

		var maxHeight = imageHeight > this.params.imageMaxHeight ? this.params.imageMaxHeight : imageHeight;

		var widthFromHeight = ( imageWidth * maxHeight ) / imageHeight;

		return maxWidth > widthFromHeight ? widthFromHeight : maxWidth;
	}

	this.setContent = function()
	{
		// If no image
		if (this.currentImage == null) {
			return;
		}

		var html = '<div class="' + this.globalClass + '" id="' + this.globalId + '" >'
		html += this.setBox();
		html += this.setSelector();
		html += '</div>';

		this.element.after(html);

		this.updateCurrentImage();
	};

	this.setBox = function()
	{
		var html = '';
		html += '<div class="' + this.boxClass + '" >';
		html += '<img class="' + this.imageClass + '" style="' + this.imageStyle + '" />';
		html += '</div>'

		return html;
	}

	this.setSelector = function()
	{
		var selectorStyle = 'height:' + this.params.selectorHeight + 'px; width:' + this.params.selectorWidth + 'px;';
		var html = '';
		html += '<div class="' + this.selectorClass + '" style="' + selectorStyle + '" >';
		html += '<div style="height:' + this.params.selectorHeight + 'px; width:' + this.totalImageWidth + 'px" >'

		for (var i = 0; i < this.images.length; i++) {
			html += '<img src="'+ this.images[i].src +'" data-id="' + this.images[i].id + '" style="' + this.imageStyle + '" />';
		};

		html += '</div>'
		html += '</div>'

		return html;
	}

	this.updateCurrentImage = function()
	{
		this.element.next('.' + this.globalClass + ':first').find('.' + this.imageClass).attr('src',this.currentImage.src);
	}

	this.updateWidgetInput = function()
	{
		this.element.val(this.currentImage.id)
	}

	this.loadImages();

	$(document).on('click', '#' + this.globalId + ' .' + this.boxClass, function(){
		$(this).next('.' + that.selectorClass + ':first').fadeIn();
	});

	$(document).on('click', '#' + this.globalId + ' .' + this.selectorClass + ' img', function() {
		that.currentImage = {
			id: $(this).attr('data-id'),
			src: $(this).attr('src'),
		}
		that.updateCurrentImage();
		that.updateWidgetInput();
		$(this).parent().parent().fadeOut();
	});
}

$.fn.imagePicker = function(params) {
    new ImagePicker(this, params);
};
