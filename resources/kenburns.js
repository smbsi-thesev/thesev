(function($){

    $.fn.kenburns = function(options) {
		app.u.dump("kenburnsing");
		
		var requestAnimFrame = 	window.requestAnimationFrame       ||
								window.webkitRequestAnimationFrame ||
								window.mozRequestAnimationFrame    ||
								window.oRequestAnimationFrame      ||
								window.msRequestAnimationFrame     ||
								function(callback) {
									window.setTimeout(callback, 1000 / 60);
								};
		
        var $canvas = $(this);
		$canvas.data('kenburns',true);
        var ctx = this[0].getContext('2d');
        var start_time = null;
        var width = $canvas.outerWidth();
        var height = $canvas.outerHeight();
		ctx.canvas.width = width;
		ctx.canvas.height = height;
        var image_paths = options.images;
        var display_time = options.display_time || 7000;
        var fade_time = Math.min(display_time / 2, options.fade_time || 1000);
        var solid_time = display_time - (fade_time * 2);
        var fade_ratio = fade_time - display_time
        var frames_per_second = options.frames_per_second || 30;
        var frame_time = (1 / frames_per_second) * 1000;
        var zoom_level = 1 / (options.zoom || 2);
		var padding_level = options.padding;	
		var clear_color = options.background_color || '#000000';

        var images = [];
        $(image_paths).each(function(i, image_path){
            images.push({path:image_path,
                         initialized:false,
                         loaded:false});
        });
        function get_time() {
            var d = new Date();
            return d.getTime() - start_time;
        }

        function interpolate_point(x1, y1, x2, y2, i) {
            // Finds a point between two other points
            return  {x: x1 + (x2 - x1) * i,
                     y: y1 + (y2 - y1) * i}
        }

        function interpolate_rect(r1, r2, i) {
            // Blend one rect in to another
            var p1 = interpolate_point(r1[0], r1[1], r2[0], r2[1], i);
            var p2 = interpolate_point(r1[2], r1[3], r2[2], r2[3], i);
            return [p1.x, p1.y, p2.x, p2.y];
        }
		
		function myinterpolate_rect(r1, r2, i){
			var p1 = interpolate_point(r1[0],r1[1],r2[0],r2[1],i);
			var p2 = interpolate_point(	r1[0]+r1[2],
										r1[1]+ r1[3],
										r2[0]+r2[2],
										r2[1]+r2[3],
										i); 
			return[p1.x, p1.y, p2.x-p1.x, p2.y-p1.y];
		}

        function scale_rect(r, scale) {
            // Scale a rect around its center
            var w = r[2] - r[0];
            var h = r[3] - r[1];
            var cx = (r[2] + r[0]) / 2;
            var cy = (r[3] + r[1]) / 2;
            var scalew = w * scale;
            var scaleh = h * scale;
            return [cx - scalew/2,
                    cy - scaleh/2,
                    cx + scalew/2,
                    cy + scaleh/2];
        }

        function fit(src_w, src_h, dst_w, dst_h) {
            // Finds the best-fit rect so that the destination can be covered
            
			var src_a = src_w / src_h;
            var dst_a = dst_w / dst_h;
            var w = src_h * dst_a;
            var h = src_h;
            if (w > src_w)
            {
                var w = src_w;
                var h = src_w / dst_a;
            }
            var x = (src_w - w) / 2;
            var y = (src_h - h) / 2;
			//app.u.dump(x+".."+y+".."+w+".."+h);
            return [x, y, x+w, y+h];
			
        }
		
		function myfit(src_w, src_h, dst_w, dst_h, padding){
			var w, h;
			if((dst_w/src_w)*src_h <= dst_h){
				w = dst_w;
				h = (dst_w/src_w)*src_h;
				}
			else {
				h = dst_h;
				w = (dst_h/src_h)*src_w;
				}
			
			padding = padding || 1;
			
			w *= padding;
			h *= padding;
			
			return [(dst_w-w)/2,(dst_h-h)/2,w,h];
			
		}
		
		function myscale(rect, scale){
			var w = rect[2] * scale;
            var h = rect[3] * scale;
            var cx = rect[0] + rect[2]/2;
            var cy = rect[1] + rect[3]/2;
			return [cx - w/2, cy - h/2, w, h];
		}
		
        function get_image_info(image_index, load_callback) {
            // Gets information structure for a given index
            // Also loads the image asynchronously, if required
            var image_info = images[image_index];
            if (!image_info.initialized) {
                var image = new Image();
                image_info.image = image;
                image_info.loaded = false;
                image.onload = function(){
                    image_info.loaded = true;
                    var iw = image.width;
                    var ih = image.height;

                    var r1 = fit(iw, ih, width, height);
                    var r2 = scale_rect(r1, zoom_level);
					
					var r3 = myfit(iw,ih,width,height, padding_level);
					var r4 = myscale(r3, zoom_level);
					
					app.u.dump(r3);
					app.u.dump(r4);
					
                    var align_x = Math.floor(Math.random() * 3) - 1;
                    var align_y = Math.floor(Math.random() * 3) - 1;
                    align_x /= 2;
                    align_y /= 2;

                    var x = r2[0];
                    r2[0] += x * align_x;
                    r2[2] += x * align_x;

                    var y = r2[1];
                    r2[1] += y * align_y;
                    r2[3] += y * align_y;
					
					x = r4[0];
                    r4[0] += x * align_x;
                    
					
					y = r4[1];
                    r4[1] += y * align_y;
					
                    if (image_index % 2) {
                        image_info.r1 = r1;
                        image_info.r2 = r2;
                        image_info.r3 = r3;
                        image_info.r4 = r4;
                    }
                    else {
                        image_info.r1 = r2;
                        image_info.r2 = r1;
                        image_info.r3 = r4;
                        image_info.r4 = r3;
                    }

                    if(load_callback) {
                        load_callback();
                    }

                }
                image_info.initialized = true;
                image.src = image_info.path;
            }
            return image_info;
        }

        function render_image(image_index, anim, fade) {
            // Renders a frame of the effect
            if (anim > 1) {
                return;
            }
            var image_info = get_image_info(image_index);
            if (image_info.loaded) {
                //var r = interpolate_rect(image_info.r1, image_info.r2, anim);
				var r = myinterpolate_rect(image_info.r3, image_info.r4, anim);
				//app.u.dump(r);
                var transparency = Math.min(1, fade);

                if (transparency > 0) {
                    ctx.save();
                    ctx.globalAlpha = Math.min(1, transparency);
					//app.u.dump(r);
					//app.u.dump(width);
					//app.u.dump(height);
                    //ctx.drawImage(image_info.image, r[0], r[1], r[2] - r[0], r[3] - r[1], 0, 0, width, height);
                    try{
						ctx.drawImage(image_info.image, r[0], r[1], r[2], r[3]);
						}
					catch(e){
						app.u.dump(e);
						app.u.dump(r);
						}
                    ctx.restore();
                }
            }
        }

        function clear() {
            // Clear the canvas
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.fillStyle = clear_color;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }

        function update() {
            // Render the next frame
			ctx.clearRect(0,0,width,height);
            ctx.fillStyle = clear_color;
			ctx.fillRect(0,0,width,height);
            var update_time = get_time();

            var top_frame = Math.floor(update_time / (display_time - fade_time));
            var frame_start_time = top_frame * (display_time - fade_time);
            var time_passed = update_time - frame_start_time;

            function wrap_index(i) {
                return (i + images.length) % images.length;
            }

            if (time_passed < fade_time)
            {
                var bottom_frame = top_frame - 1;
                var bottom_frame_start_time = frame_start_time - display_time + fade_time;
                var bottom_time_passed = update_time - bottom_frame_start_time;
                if (update_time < fade_time) {
                    clear();
                } else {
                    render_image(wrap_index(bottom_frame), bottom_time_passed / display_time, 1 - (time_passed/fade_time));
                }
            }

            render_image(wrap_index(top_frame), time_passed / display_time, time_passed / fade_time);

            if (options.post_render_callback) {
                options.post_render_callback($canvas, ctx);
            }

            // Pre-load the next image in the sequence, so it has loaded
            // by the time we get to it
            var preload_image = wrap_index(top_frame + 1);
            get_image_info(preload_image);
			
			if(true){
                requestAnimFrame(update);
				}
        }

        // Pre-load the first two images then start a timer
        get_image_info(0, function(){
            get_image_info(1, function(){
                start_time = get_time();
                requestAnimFrame(update);
            })
        });

    };

})( jQuery );