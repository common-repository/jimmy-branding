=== Jimmy Branding ===
Contributors: kenjmk7r9merchant
Plugin Name: Jimmy Branding
Plugin URI: http://electronics.jimmykenmerchant.com/jimmy-branding/
Tags: webgl, 3d, branding, brand, banner, billboard
Author: Kenta Ishii
Author URI: http://electronics.jimmykenmerchant.com
Requires at least: 4.7
Tested up to: 4.9
Stable tag: 1.0.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==

Size-flexible Banner for Your Website. Use as your unique billboard! Template Tag, Shortcode and 'SENOR' WebGL Library.

**Futures**

* Template Tag, 'jimmy_branding_output'
* Shortcode, '[jimmy_branding]'
* Triangle Opener to Change Height Size of Banner
* 'jBrandings' Admin Menu
* 'jPromoter' Role
* Original WebGL library, 'SENOR'

'SENOR' (exactly, 'SENOR' is the naming union of 'SENORWEBGL1', 'SENORWEBGL2' and 'SENORUTL') is an client side WebGL library of Kenta Ishii licensed under GPLv2 or later. This Library aims to be "System of Whole Objective Oriented Structure" to make/transmit data of 3D-graphic (Three Dimensional Graphic) in/between client computers and servers. This system is unique because whole processes depend on object-oriented architecture. By doing so, engineers to participate in 3D-graphic projects can be able to build systems easier than inconsistent structures. 'SENOTRWEBGL1' is a wrapper of WebGL1.0 context. 'SENORWEBGL2' is a wrapper of WebGL2.0 context ('SENORWEBGL2' is now on reserved). 'SENORUTL' is utilities to make 3D-graphic. 'SENOR' also aims to consider compatibility to code between 'SENORWEBGL1', WebGL1.0 context and 'SENORWEBGL2', WebGL2.0 context. It's so called "The Same Coding Rarely Except Extension". By wrapping whole context with each 'canvas' HTML tag, 'SENOR' aims usage of multiple contexts on the same page of your website.

'SENOR' Library System Chart ('SENOR' is using a three-phases procedure as below)

             Internet
     (TCP/IP Protocol, etc.)
               | ^
    From       | | To Server
    Server     | | From
    To Client  | | Client
               v |
    -------------------------
    |     (1) Raw Data      |
    | Vertices, Coordinates,|
    | Phong Parameter, etc. |
    |  On JSON (JavaScript  |
    | Object Notation), etc.|
    -------------------------
               | ^
    Object by  | |Raw Data by
    JavaScript | |JavaScript
               | |
               v |
    -------------------------
    |     (2) Objectify     |
    | Initialize WebGL.     |
    | Combine Objects to    |
    | Use as a 3D Model.    |
    |  Via 'SENOR' Library  |
    -------------------------
               | ^
    Output to  | | Input by  
    Display by | | User
    WebGL      | | Communi-
               v | cation
    -------------------------
    |     (3) Use Object    |
    | In Applications,      |
    | Game, CAI (Computer-  |
    | Assisted Instruction) |
    | CAD, Monitor, etc.    |
    -------------------------

**Usage**

Template Tag, jimmy_branding_output

    if ( function_exists( 'jimmy_branding_output' ) ) {
        // If you want, configure ID of this template in the argument of this template tag as String
        jimmy_branding_output();
    }

* Put the template tag on your theme, e.g., index.php.
* Make your branding HTML code on 'jBrandings' menu.
* Select your jBranding content on 'Select' sub menu.
* Customize banner and opener (Triangle on the Center Bottom) size on 'Select' sub menu.

Shortcode, [jimmy_branding]

    [jimmy_branding name="slug-name-of-your-jbranding-content"]

* On 'Select' sub menu, check 'SENOR WebGL Library' to 'Stand Alone' and 'Shortcode Usage' to 'Use'.
* On your post, use shortcode [jimmy_branding] with several arguments. 'name' must be needed.

Arguments of the WordPress shortcode, [jimmy_branding]

* 'id' - (default: 'jimmy-branding')
* 'name' - assign slug name of your jBranding content, must be needed
* 'ratio' - 'false' is using pixels, 'parent' is using width parent element's width, 'window' is using window's width and height to make the resolution of the template (default: 'false')
* 'width_pixels' - (default: '300')
* 'width_percents' - (default: '100')
* 'height_min' - (default: '100')
* 'height_min_percents' - (default: '10')
* 'height_max' - (default: '200')
* 'height_max_percents' - (default: '20')
* 'opener_color' - (default: '#ff0')
* 'opener_width' - (default: '28')
* 'opener_choice' - Show Opener ('true') or not (default: 'true')

Usage Samples are on <http://electronics.jimmykenmerchant.com/jimmy-branding/> please check out.

== Installation ==

From "Plugins" of your admin page, just search and install "Jimmy Branding". Make sure to activate "Jimmy Branding" in "Installed Plugins", a "Plugins" sub menu.

You can download and test the latest version of this plugin from GitHub public repository. <http://electronics.jimmykenmerchant.com/jimmy-branding/>

== Frequently Asked Questions ==

= Why does 'SENOR' have no function to make texture by 'Image' object or 'img' tag directly? =

'Image' object and 'img' tag have the process to load each image. This loading process is a little tricky as opposed to the native usage of OpenGL. If the image has not been loaded yet, making texture fails. To hide this failure, 'SENOR' has the function to make texture by URL address or pixels data. In case of making texture by 'video' tag, you need to draw the video image to a 2D canvas by CanvasRenderingContext2D.drawImage(), then make RGBA pixels data with the canvas by CanvasRenderingContext2D.getImageData() (returns ImageData object which includes width, height and pixels similar to gl.RGBA8). The function, getImageData, is restricted by Same-Origin Policy or CORS (Cross-Origin Resource Sharing). Put 'crossorigin' attribute on the 'video' tag if you need. Plus, make sure to play and control the video by functions, and iterate the process of drawImage, getImageData and making/update texture. The Codec and its container (extension) of the video file is needed to be able to play on browsers by 'video' tag.

= Why does 'SENOR' have no function to load files of raw data? =

Media Loader of WordPress Admin Page aims to store binary data just like JPEG, PNG and other Video/Audio formats. On default, this loader can't load not only minor types of files, but also text files. Basically, raw data of 3D vertices is text data. Beacause of security, WordPress core developers will stay this policy, and may become stricter than now. So I recommend to put raw (text) data of vertices on your jBranding content directly (in script type="text/plain" tag). 'SENOR' has a function to convert a text data of Wavefront .obj style to a JavaScript Object, 'SENORUTL.attachObjRaw( id )'.

== Copyright ==

The Jimmy Branding, A WordPress Plugin, Copyright 2017 Kenta Ishii.
Jimmy Branding is distributed under the terms of the GNU GPL.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

Several codes of 'SENOR', a WebGL library are derived from Mozilla Developer Network, <https://github.com/mdn/webgl-examples> . The license is under Creative Commons Zero v1.0 Universal, <https://github.com/mdn/webgl-examples/blob/gh-pages/LICENSE> . This license is compatible with GPLv2 or later.

== Screenshots ==
1. Usage Sample of Template Tag, 'jimmy_branding_output'
2. Usage sample of Shortcode, '[jimmy_branding]'
3. 'Select' Sub Menu of 'jBrandings' Menu

== Upgrade Notice ==
= 1.0.4 =
Please upgrade because of fixing bugs and having new futures: Confirmed Compatibility with WordPress Version 4.9.

== Changelog ==

= 1.0.4 =
* Confirmed Compatibility with WordPress Version 4.9
: April 26, 2018

= 1.0.3 =
* Modified README.txt for Readability
: June 22, 2017

= 1.0.2 =
* Modified README.txt
: June 22, 2017

= 1.0.1 =
* Added minimized files of JavaScript for increasing loading speed on browsers
: June 21, 2017

= 1.0 =
* Release in WordPress.org
: June 21, 2017

= 0.9.4 Beta =
* Made Texture Array Two dimention
* Made functions for Cube Texture
: June 13, 2017

= 0.9.3 Beta =
* Confirmed Compatibility with WordPress Version 4.8
: June 9, 2017

= 0.9.2 Beta =
* Improved 'SENOR' WebGL Library
* Added WordPress Shortcode, 'jimmy_branding'
: June 7, 2017

= 0.9.1 Beta =
* Released: May 30, 2017