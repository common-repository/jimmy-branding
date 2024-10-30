/**
 * senor-webgl.js, a WebGL Object Utility Library
 * Uses Text Domain, SENORWEBGL1 and SENORUTL (SENORWEBGL2 is reserved)
 * Author: Kenta Ishii
 * License: GPLv2 or later
 */


/**
 * WebGL1.0 Context Object
 * This needs 'new' declaration
 * SENORWEBGL1.Object, SENORWEBGL1.ArrayObject, SENORWEBGL1.Shaders also needs 'new'
 */
var SENORWEBGL1 = SENORWEBGL1 || function() {

	var self = this;
	self.gl = null;
	var rgba = null;


	self.activate = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}

		// Set default value
		if ( typeof parameter.canvas !== "object" || parameter.canvas === null ) {
			return false;
		}
		if ( typeof parameter.color !== "object" || parameter.color === null ) {
			parameter.color = [1.0, 1.0, 1.0, 1.0];
		}
		// Others Exist. Check by console.log( self.gl.getContextAttributes )
		if ( typeof parameter.antialias !== "boolean" || parameter.antialias === null ) {
			parameter.antialias = true;
		}
		if ( typeof parameter.stencil !== "boolean" || parameter.stencil === null ) {
			parameter.stencil = false;
		}

		// Try to grab the standard context. If it fails, fallback to experimental.
		self.gl = parameter.canvas.getContext( 'webgl', { antialias: parameter.antialias, stencil: parameter.stencil } ) || parameter.canvas.getContext( 'experimental-webgl', { antialias: parameter.antialias, stencil: parameter.stencil } );

		// If we don't have a GL context, give up now
		if ( ! self.gl ) {
			alert( 'Unable to initialize WebGL. Your browser may not support it.' );
			return false;
		}

		// Set default value with gl context
		if ( typeof parameter.cullface !== "number" || parameter.cullface === null ) {
			parameter.cullface = self.gl.BACK;
		}
		if ( typeof parameter.frontface !== "number" || parameter.frontface === null ) {
			parameter.frontface = self.gl.CCW;
		}
		if ( typeof parameter.depthfunc !== "number" || parameter.depthfunc === null ) {
			parameter.depthfunc = self.gl.LEQUAL;
		}
		if ( typeof parameter.enable_cullface !== "boolean" || parameter.enable_cullface === null ) {
			parameter.enable_cullface = true;
		}
		if ( typeof parameter.enable_depthtest !== "boolean" || parameter.enable_depthtest === null ) {
			parameter.enable_depthtest = true;
		}

		self.gl.viewport( 0, 0, parameter.canvas.width, parameter.canvas.height );

		rgba = new Float32Array( parameter.color );

		// Enable culling
		if ( parameter.enable_cullface ) {
			self.gl.cullFace( parameter.cullface );
			self.gl.frontFace( parameter.frontface );
			self.gl.enable( self.gl.CULL_FACE );
		}

		// Enable depth testing
		if ( parameter.enable_depthtest ) {
			self.gl.depthFunc( parameter.depthfunc );
			self.gl.enable( self.gl.DEPTH_TEST );
		}

		// Set clear color to black, fully opaque
		// For all transparent, use all zeros
		self.gl.clearColor( rgba[0], rgba[1], rgba[2], rgba[3] );

		// Clear the color as well as the depth buffer
		if ( parameter.stencil ) {
			self.gl.clear( self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT | self.gl.STENCIL_BUFFER_BIT );
		} else {
			self.gl.clear( self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT );
		}

	};

	// If needed, add array of RGBA
	self.clear = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}
		if ( typeof parameter.color !== "object" || parameter.color === null ) {
			parameter.color = [];
		}

		if( parameter.color.length === 4 ) {
			var temp_rgba = new Float32Array( parameter.color );
			self.gl.clearColor( temp_rgba[0], temp_rgba[1], temp_rgba[2], temp_rgba[3] );
		} else {
			self.gl.clearColor( rgba[0], rgba[1], rgba[2], rgba[3] );
		}
		self.gl.clear( self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT );
	};


	// If needed, add array of RGBA
	self.clearWithStencil = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}
		if ( typeof parameter.color !== "object" || parameter.color === null ) {
			parameter.color = [];
		}

		if( parameter.color.length === 4 ) {
			var temp_rgba = new Float32Array( parameter.color );
			self.gl.clearColor( temp_rgba[0], temp_rgba[1], temp_rgba[2], temp_rgba[3] );
		} else {
			self.gl.clearColor( rgba[0], rgba[1], rgba[2], rgba[3] );
		}
		self.gl.clear( self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT | self.gl.STENCIL_BUFFER_BIT );
	};


	/**
	 * Object to render
	 *
	 * shaders, vertices, buffers, vao, vao_index,
	 * textures, callUniforms, geometry_mode, geometry_first, geometry_count,
	 * x, y, z, x_speed, y_speed, z_speed,
	 * origin_x, origin_y, origin_z,
	 * sx, sy, sz, sx_speed, sy_speed, sz_speed,
	 * angle, rx, ry, rz, angle_speed, rx_speed, ry_speed, rz_speed,
	 * ks, kd, ka,
	 * x_radius, y_radius, z_radius, sequence, reserve
	 */
	self.Object = function( parameter ) {
		// If noting, initialize parameter
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}

		// Fundamental shading materials
		if ( typeof parameter.shaders !== "object" || parameter.shaders === null ) {
			parameter.shaders = [];
		}
		if ( typeof parameter.vertices !== "object" || parameter.vertices === null ) {
			parameter.vertices = [];
		}
		if ( typeof parameter.buffers !== "object" || parameter.buffers === null ) {
			parameter.buffers = [];
		}
		if ( typeof parameter.vao !== "object" || parameter.vao === null ) {
			parameter.vao = [];
		}
		if ( typeof parameter.vao_index !== "number" || parameter.vao_index === null ) {
			parameter.vao_index = 0;
		}
		if ( typeof parameter.textures !== "object" || parameter.textures === null ) {
			parameter.textures = [];
		}
		// Set the function for uniform variable
		if ( typeof parameter.callUniforms !== "function" || parameter.callUniforms === null ) {
			parameter.callUniforms = null;
		}
		if ( typeof parameter.geometry_mode !== "object" || parameter.geometry_mode === null ) {
			parameter.geometry_mode = [];
		}
		if ( typeof parameter.geometry_first !== "object" || parameter.geometry_first === null ) {
			parameter.geometry_first = [];
		}
		// Attribute Number of Geometry Vertices in Vertex Shader
		if ( typeof parameter.geometry_count !== "object" || parameter.geometry_count === null ) {
			parameter.geometry_count = [];
		}

		this.shaders = parameter.shaders;
		this.vertices = parameter.vertices;
		this.buffers = parameter.buffers;
		this.vao = parameter.vao;
		this.vao_index = parameter.vao_index;
		this.textures = parameter.textures;
		// callUniforms is for aliasing function of uniform variable storing
		this.callUniforms = parameter.callUniforms;
		this.geometry_mode = parameter.geometry_mode;
		this.geometry_first = parameter.geometry_first;
		this.geometry_count = parameter.geometry_count;

		// Position
		if ( typeof parameter.x !== "number" || parameter.x === null ) {
			parameter.x = 0.0;
		}
		if ( typeof parameter.y !== "number" || parameter.y === null ) {
			parameter.y = 0.0;
		}
		if ( typeof parameter.z !== "number" || parameter.z === null ) {
			parameter.z = 0.0;
		}

		// Per milliseconds
		if ( typeof parameter.x_speed !== "number" || parameter.x_speed === null ) {
			parameter.x_speed = 0.0;
		}
		if ( typeof parameter.y_speed !== "number" || parameter.y_speed === null ) {
			parameter.y_speed = 0.0;
		}
		if ( typeof parameter.z_speed !== "number" || parameter.z_speed === null ) {
			parameter.z_speed = 0.0;
		}

		// Use to define rotation origin
		if ( typeof parameter.x_origin !== "number" || parameter.x_origin === null ) {
			parameter.x_origin = 0.0;
		}
		if ( typeof parameter.y_origin !== "number" || parameter.y_origin === null ) {
			parameter.y_origin = 0.0;
		}
		if ( typeof parameter.z_origin !== "number" || parameter.z_origin === null ) {
			parameter.z_origin = 0.0;
		}

		this.x = parameter.x;
		this.y = parameter.y;
		this.z = parameter.z;
		this.x_speed = parameter.x_speed;
		this.y_speed = parameter.y_speed;
		this.z_speed = parameter.z_speed;
		this.x_origin = parameter.x_origin;
		this.y_origin = parameter.y_origin;
		this.z_origin = parameter.z_origin;


		// Scale
		if ( typeof parameter.sx !== "number" || parameter.sx === null ) {
			parameter.sx = 1.0;
		}
		if ( typeof parameter.sy !== "number" || parameter.sy === null ) {
			parameter.sy = 1.0;
		}
		if ( typeof parameter.sz !== "number" || parameter.sz === null ) {
			parameter.sz = 1.0;
		}

		// Per milliseconds
		if ( typeof parameter.sx_speed !== "number" || parameter.sx_speed === null ) {
			parameter.sx_speed = 0.0;
		}
		if ( typeof parameter.sy_speed !== "number" || parameter.sy_speed === null ) {
			parameter.sy_speed = 0.0;
		}
		if ( typeof parameter.sz_speed !== "number" || parameter.sz_speed === null ) {
			parameter.sz_speed = 0.0;
		}

		this.sx = parameter.sx;
		this.sy = parameter.sy;
		this.sz = parameter.sz;
		this.sx_speed = parameter.sx_speed;
		this.sy_speed = parameter.sy_speed;
		this.sz_speed = parameter.sz_speed;


		// Rotation (Actual Degrees or Quaternions)
		// Angle use for Quaternions
		if ( typeof parameter.angle !== "number" || parameter.angle === null ) {
			parameter.angle = 0;
		}
		// Actual degrees or normalized vector as axis of rotation
		if ( typeof parameter.rx !== "number" || parameter.rx === null ) {
			parameter.rx = 1.0;
		}
		if ( typeof parameter.ry !== "number" || parameter.ry === null ) {
			parameter.ry = 1.0;
		}
		if ( typeof parameter.rz !== "number" || parameter.rz === null ) {
			parameter.rz = 1.0;
		}

		// Per milliseconds
		if ( typeof parameter.angle_speed !== "number" || parameter.angle_speed === null ) {
			parameter.angle_speed = 0.0;
		}
		if ( typeof parameter.rx_speed !== "number" || parameter.rx_speed === null ) {
			parameter.rx_speed = 0.0;
		}
		if ( typeof parameter.ry_speed !== "number" || parameter.ry_speed === null ) {
			parameter.ry_speed = 0.0;
		}
		if ( typeof parameter.rz_speed !== "number" || parameter.rz_speed === null ) {
			parameter.rz_speed = 0.0;
		}

		this.angle = parameter.angle;
		this.rx = parameter.rx;
		this.ry = parameter.ry;
		this.rz = parameter.rz;
		this.angle_speed = parameter.angle_speed;
		this.rx_speed = parameter.rx_speed;
		this.ry_speed = parameter.ry_speed;
		this.rz_speed = parameter.rz_speed;


		// Surface relectance specular, diffuse, ambient
		if ( typeof parameter.ks !== "object" || parameter.ks === null ) {
			parameter.ks = [1.0, 1.0, 1.0];
		}
		if ( typeof parameter.kd !== "object" || parameter.kd === null ) {
			parameter.kd = [1.0, 1.0, 1.0];
		}
		if ( typeof parameter.ka !== "object" || parameter.ka === null ) {
			parameter.ka = [1.0, 1.0, 1.0];
		}

		this.ks = parameter.ks;
		this.kd = parameter.kd;
		this.ka = parameter.ka;


		// Length and Multipurpose Parameters
		if ( typeof parameter.x_radius !== "number" || parameter.x_radius === null ) {
			parameter.x_radius = 0.0;
		}
		if ( typeof parameter.y_radius !== "number" || parameter.y_radius === null ) {
			parameter.y_radius = 0.0;
		}
		if ( typeof parameter.z_radius !== "number" || parameter.z_radius === null ) {
			parameter.z_radius = 0.0;
		}

		// Multi (Two) Dimentional Array
		// e.g. Store Array Number, Sequence Number and Passed Time on First Array
		if ( typeof parameter.sequence !== "object" || parameter.sequence === null ) {
			parameter.sequence = [];
		}

		// Uni Dimentional Array
		if ( typeof parameter.reserve !== "object" || parameter.reserve === null ) {
			parameter.reserve = [];
		}

		this.x_radius = parameter.x_radius;
		this.y_radius = parameter.y_radius;
		this.z_radius = parameter.z_radius;
		this.sequence = parameter.sequence;
		this.reserve = parameter.reserve;
	};


	/**
	 * Common functions of Object
	 */

	// First, register shaders
	self.Object.prototype.registerShaders = function( parameter ) {
		this.shaders[this.shaders.length] = new self.Shaders( parameter );
	};


	// Second, Register function for storing uniform variables in shaders
	// Register function by aliasing (no need of parenthesis to function name for aliasing)
	self.Object.prototype.registerUniforms = function( func ) {
		this.callUniforms = func;
	};


	// Third, Registor vertices of geometry, color, texture mapping, normal, etc. and texture
	self.Object.prototype.registerVao = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}

		if ( typeof parameter.vertices !== "object" || parameter.vertices === null ) {
			parameter.vertices = [];
		}
		if ( typeof parameter.textures !== "object" || parameter.textures === null ) {
			parameter.textures = [];
		}
		if ( typeof parameter.geometry_mode !== "number" || parameter.geometry_mode === null ) {
			parameter.geometry_mode = self.gl.TRIANGLES;
		}
		if ( typeof parameter.geometry_first !== "number" || parameter.geometry_first === null ) {
			parameter.geometry_first = 0;
		}
		// Index Number of Geometry Attribute in Vertex Shader
		if ( typeof parameter.geometry_attribute_index !== "number" || parameter.geometry_attribute_index === null ) {
			parameter.geometry_attribute_index = 0;
		}
		// Length of Geometry Vertices in Each Array
		if ( typeof parameter.geometry_length !== "number" || parameter.geometry_length === null ) {
			parameter.geometry_length = 3;
		}
		var pre_vao_index = this.vao.length;
		this.vao[pre_vao_index] = [];
		var num = this.vertices.length;
		for ( var i = 0, a = parameter.vertices.length; i < a; i++ ) {
			this.vertices[num + i] = parameter.vertices[i];
			this.registerVertices( num + i );
			// last one of buffers
			this.vao[pre_vao_index][i] = this.buffers[this.buffers.length - 1];
		}

		// Registor Textures
		this.textures[pre_vao_index] = [];
		for ( var i = 0, a = parameter.textures.length; i < a; i++ ) {
			this.textures[pre_vao_index][i] = parameter.textures[i];
		}

		// To use as self.gl.drawArrays arguments
		// Register vertices number and its length to draw geometry
		this.geometry_mode[pre_vao_index] = parameter.geometry_mode;
		this.geometry_first[pre_vao_index] = parameter.geometry_first;
		this.geometry_count[pre_vao_index] = parseInt( ( this.vertices[num + parameter.geometry_attribute_index].length - parameter.geometry_first ) / parameter.geometry_length );
	};


	self.Object.prototype.registerVertices = function( index ) {
		if ( index === "" || typeof index === "undefined" ) {
			index = 0;
		}
		this.buffers[this.buffers.length] = self.registerBuffer( this.vertices[index] );
	};


	// Finally, draw itself
	// Number of vertices arraies in each unit is fixed. This function refers length of the first VAO
	self.Object.prototype.pict = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}

		if ( typeof parameter.attributes !== "object" || parameter.attributes === null ) {
			parameter.attributes = {};
		}
		if ( typeof parameter.shader_index !== "number" || parameter.shader_index === null ) {
			parameter.shader_index = 0;
		}

		self.gl.useProgram( this.shaders[parameter.shader_index].program );
		this.callVao( parameter.shader_index );
		this.callUniforms( parameter, self );
		self.gl.drawArrays( this.geometry_mode[this.vao_index], this.geometry_first[this.vao_index], this.geometry_count[this.vao_index] );
		self.gl.bindBuffer( self.gl.ARRAY_BUFFER, null );
		self.gl.bindTexture( self.gl.TEXTURE_2D, null );
	};


	self.Object.prototype.callVao = function( shader_index ) {
		if ( shader_index === "" || typeof shader_index === "undefined" ) {
			shader_index = 0;
		}
		var target_vao = this.vao[this.vao_index];
		for ( var i = 0, a = target_vao.length; i < a; i++ ) {
			self.gl.bindBuffer( self.gl.ARRAY_BUFFER, target_vao[i] );
			self.gl.vertexAttribPointer( this.shaders[shader_index].attributes[i], this.shaders[shader_index].unit_length[i], self.gl.FLOAT, false, 0, 0 );
		}
	};

	self.Object.prototype.free = function() {
		if ( this.shaders !== null ) {
			for ( var i = 0, a = this.shaders.length; i < a; i++ ) {
				var index = this.shaders.length - 1;
				if ( this.shaders[index].attributes !== null ) {
					for ( var j = 0, b = this.shaders[index].attributes.length; j < b; j++ ) {
						var index_2 = this.shaders[index].attributes.length - 1;
						self.gl.disableVertexAttribArray( this.shaders[index].attributes[index_2] );
						this.shaders[index].attributes[index_2] = null;
						this.shaders[index].attributes.pop();
					}
				}
				this.shaders[index].attributes = null;
				self.gl.deleteProgram( this.shaders[index].program );
				this.shaders[index].program = null;
				this.shaders[index] = null;
				this.shaders.pop();
			}
		}
		this.shaders = null;

		if ( this.vertices !== null ) {
			for ( var i = 0, a = this.vertices.length; i < a; i++ ) {
				this.vertices[this.vertices.length - 1] = null;
				this.vertices.pop();
			}
		}
		this.vertices = null;

		if ( this.buffers !== null ) {
			for ( var i = 0, a = this.buffers.length; i < a; i++ ) {
				var index = this.buffers.length - 1;
				self.gl.deleteBuffer( this.buffers[index] );
				this.buffers[index] = null;
				this.buffers.pop();
			}
		}
		this.buffers = null;

		if ( this.vao !== null ) {
			for ( var i = 0, a = this.vao.length; i < a; i++ ) {
				this.vao[this.vao.length - 1] = null;
				this.vao.pop();
			}
		}
		this.vao = null;

		this.vao_index = null;

		// Multi (Two) Dimentional Array
		if ( this.textures !== null ) {
			for ( var i = 0, a = this.textures.length; i < a; i++ ) {
				var index = this.textures.length - 1;
				if ( this.textures[index] !== null ) {
					for ( var j = 0, b = this.textures[index].length; j < b; j++ ) {
						var index_2 = this.textures[index].length - 1;
						self.gl.deleteTexture( this.textures[index][index_2] );
						this.textures[index][index_2] = null;
						this.textures[index].pop();
					}
				}
				this.textures[index] = null;
				this.textures.pop();
			}
		}
		this.textures = null;

		this.callUniforms = null;

		if ( this.geometry_mode !== null ) {
			for ( var i = 0, a = this.geometry_mode.length; i < a; i++ ) {
				this.geometry_mode[this.geometry_mode.length - 1] = null;
				this.geometry_mode.pop();
			}
		}
		this.geometry_mode = null;

		if ( this.geometry_first !== null ) {
			for ( var i = 0, a = this.geometry_first.length; i < a; i++ ) {
				this.geometry_first[this.geometry_first.length - 1] = null;
				this.geometry_first.pop();
			}
		}
		this.geometry_first = null;

		if ( this.geometry_count !== null ) {
			for ( var i = 0, a = this.geometry_count.length; i < a; i++ ) {
				this.geometry_count[this.geometry_count.length - 1] = null;
				this.geometry_count.pop();
			}
		}
		this.geometry_count = null;

		this.x = null;
		this.y = null;
		this.z = null;
		this.x_speed = null;
		this.y_speed = null;
		this.z_speed = null;
		this.x_origin = null;
		this.y_origin = null;
		this.z_origin = null;

		this.sx = null;
		this.sy = null;
		this.sz = null;
		this.sx_speed = null;
		this.sy_speed = null;
		this.sz_speed = null;

		this.angle = null;
		this.rx = null;
		this.ry = null;
		this.rz = null;
		this.angle_speed = null;
		this.rx_speed = null;
		this.ry_speed = null;
		this.rz_speed = null;

		if ( this.ks !== null ) {
			for ( var i = 0, a = this.ks.length; i < a; i++ ) {
				this.ks[this.ks.length - 1] = null;
				this.ks.pop();
			}
		}
		this.ks = null;

		if ( this.kd !== null ) {
			for ( var i = 0, a = this.kd.length; i < a; i++ ) {
				this.kd[this.kd.length - 1] = null;
				this.kd.pop();
			}
		}
		this.kd = null;

		if ( this.ka !== null ) {
			for ( var i = 0, a = this.ka.length; i < a; i++ ) {
				this.ka[this.ka.length - 1] = null;
				this.ka.pop();
			}
		}
		this.ka = null;

		this.x_radius = null;
		this.y_radius = null;
		this.z_radius = null;

		// Multi (Two) Dimentional Array
		if ( this.sequence !== null ) {
			for ( var i = 0, a = this.sequence.length; i < a; i++ ) {
				var index = this.sequence.length - 1;
				if ( this.sequence[index] !== null ) {
					for ( var j = 0, b = this.sequence[index].length; j < b; j++ ) {
						this.sequence[index][this.sequence[index].length - 1] = null;
						this.sequence[index].pop();
					}
				}
				this.sequence[index] = null;
				this.sequence.pop();
			}
		}
		this.sequence = null;

		// Reserve should be number or string or function, not object or array
		// If you want store object or array in reserve, make free memory process itself
		if ( this.reserve !== null ) {
			for ( var i = 0, a = this.reserve.length; i < a; i++ ) {
				this.reserve[this.reserve.length - 1] = null;
				this.reserve.pop();
			}
		}
		this.reserve = null;

	};


	/**
	 * Use in Object to render
	 *
	 * Activate shaders with pointing attributes
	 * This needs 'new' declaration
	 */

	self.Shaders = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}

		if ( typeof parameter.vertex_shader !== "string" || parameter.vertex_shader === null ) {
			parameter.vertex_shader = "";
		}
		if ( typeof parameter.fragment_shader !== "string" || parameter.fragment_shader === null ) {
			parameter.fragment_shader = "";
		}
		if ( typeof parameter.attributes !== "object" || parameter.attributes === null ) {
			parameter.attributes = [];
		}
		if ( typeof parameter.unit_length !== "object" || parameter.unit_length === null ) {
			parameter.unit_length = [];
		}

		var vertex_shader = self.getShader( parameter.vertex_shader );
		var fragment_shader = self.getShader( parameter.fragment_shader );

		// Create the shader program
		this.program = self.gl.createProgram();
		this.attributes = [];
		this.unit_length = [];
		self.gl.attachShader( this.program, vertex_shader );
		self.gl.attachShader( this.program, fragment_shader );
		self.gl.linkProgram( this.program );

		// If creating the shader program failed, alert
		if ( ! self.gl.getProgramParameter( this.program, self.gl.LINK_STATUS ) ) {
			alert( "Unable to initialize the shader program: " + self.gl.getProgramInfoLog( this.program ) );
		}
		
		for ( var i = 0, a = parameter.attributes.length; i < a; i++ ) {
			this.attributes[i] = self.gl.getAttribLocation( this.program, parameter.attributes[i] );
			self.gl.enableVertexAttribArray( this.attributes[i] );
		}

		for ( var i = 0, a = parameter.unit_length.length; i < a; i++ ) {
			this.unit_length[i] = parameter.unit_length[i];
		}

		self.gl.deleteShader( vertex_shader );
		self.gl.deleteShader( fragment_shader );
	};


	self.getShader = function( id ) {
		var shaderScript = document.getElementById( id );

		// Didn't find an element with the specified ID; abort.
		if ( ! shaderScript ) {
			return false;
		}

		// Walk through the source element's children, building the
		// shader source string.
		var theSource = "";
		var currentChild = shaderScript.firstChild;

		while ( currentChild ) {
			if ( currentChild.nodeType == 3 ) {
				theSource += currentChild.textContent;
			}
			currentChild = currentChild.nextSibling;
		}

		// Now figure out what type of shader script we have,
		// based on its MIME type.
		var shader;

		if ( shaderScript.type == "x-shader/x-fragment" ) {
			shader = self.gl.createShader( self.gl.FRAGMENT_SHADER );
		} else if ( shaderScript.type == "x-shader/x-vertex" ) {
			shader = self.gl.createShader( self.gl.VERTEX_SHADER );
		} else {
			return false;  // Unknown shader type
		}

		// Send the source to the shader object
		self.gl.shaderSource( shader, theSource );

		// Compile the shader program
		self.gl.compileShader( shader );

		// See if it compiled successfully
		if ( ! self.gl.getShaderParameter( shader, self.gl.COMPILE_STATUS ) ) {
			alert( "An error occurred compiling the shaders: " + self.gl.getShaderInfoLog( shader ) );
			return false;
		}

		return shader;
	};


	/**
	 * Use in Object to render
	 */
	self.registerBuffer = function( vertices ) {

		// Create a buffer for the square's vertices.
		var buffer = self.gl.createBuffer();

		// Select the squareVerticesBuffer as the one to apply vertex
		// operations to from here out.
		self.gl.bindBuffer( self.gl.ARRAY_BUFFER, buffer );

		// Now pass the list of vertices into WebGL to build the shape. We
		// do this by creating a Float32Array from the JavaScript array,
		// then use it to fill the current vertex buffer.
		self.gl.bufferData( self.gl.ARRAY_BUFFER, new Float32Array( vertices ), self.gl.STATIC_DRAW );

		self.gl.bindBuffer( self.gl.ARRAY_BUFFER, null );

		return buffer;
	};


	/**
	 * Array Object for Object
	 * This needs 'new' declaration
	 */
	self.ArrayObject = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === "null" ) {
			parameter = new self.Object();
		}
		
		// Inherit Array Object
		Array.call( this );

		this.shaders = parameter.shaders;
		this.vertices = parameter.vertices;
		this.buffers = parameter.buffers;
		this.vao = parameter.vao;
		this.vao_index = parameter.vao_index;
		this.textures = parameter.textures;
		this.callUniforms = parameter.callUniforms;
		this.geometry_mode = parameter.geometry_mode;
		this.geometry_first = parameter.geometry_first;
		this.geometry_count = parameter.geometry_count;

		this.x = parameter.x;
		this.y = parameter.y;
		this.z = parameter.z;
		this.x_speed = parameter.x_speed;
		this.y_speed = parameter.y_speed;
		this.z_speed = parameter.z_speed;
		this.x_origin = parameter.x_origin;
		this.y_origin = parameter.y_origin;
		this.z_origin = parameter.z_origin;

		this.sx = parameter.sx;
		this.sy = parameter.sy;
		this.sz = parameter.sz;
		this.sx_speed = parameter.sx_speed;
		this.sy_speed = parameter.sy_speed;
		this.sz_speed = parameter.sz_speed;

		this.angle = parameter.angle;
		this.rx = parameter.rx;
		this.ry = parameter.ry;
		this.rz = parameter.rz;
		this.angle_speed = parameter.angle_speed;
		this.rx_speed = parameter.rx_speed;
		this.ry_speed = parameter.ry_speed;
		this.rz_speed = parameter.rz_speed;

		this.ks = parameter.ks;
		this.kd = parameter.kd;
		this.ka = parameter.ka;

		this.x_radius = parameter.x_radius;
		this.y_radius = parameter.y_radius;
		this.z_radius = parameter.z_radius;
		this.sequence = parameter.sequence;
		this.reserve = parameter.reserve;

	};

	// Inherit prototype of Array Object
	self.ArrayObject.prototype = Object.create( Array.prototype );

	self.ArrayObject.prototype.add = function( parameter ) {
		// If noting, initialize parameter
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}

		var push_object = new self.Object();

		// Fundamental shading materials
		if ( typeof parameter.shaders !== "object" || parameter.shaders === null ) {
			parameter.shaders = this.shaders;
		}
		if ( typeof parameter.vertices !== "object" || parameter.vertices === null ) {
			parameter.vertices = this.vertices;
		}
		if ( typeof parameter.buffers !== "object" || parameter.buffers === null ) {
			parameter.buffers = this.buffers;
		}
		if ( typeof parameter.vao !== "object" || parameter.vao === null ) {
			parameter.vao = this.vao;
		}
		if ( typeof parameter.vao_index !== "number" || parameter.vao_index === null ) {
			parameter.vao_index = this.vao_index;
		}
		if ( typeof parameter.textures !== "object" || parameter.textures === null ) {
			parameter.textures = this.textures;
		}
		// Set the function for uniform variable
		if ( typeof parameter.callUniforms !== "function" || parameter.callUniforms === null ) {
			parameter.callUniforms = this.callUniforms;
		}
		if ( typeof parameter.geometry_mode !== "object" || parameter.geometry_mode === null ) {
			parameter.geometry_mode = this.geometry_mode;
		}
		if ( typeof parameter.geometry_first !== "object" || parameter.geometry_first === null ) {
			parameter.geometry_first = this.geometry_first;
		}
		if ( typeof parameter.geometry_count !== "object" || parameter.geometry_count === null ) {
			parameter.geometry_count = this.geometry_count;
		}

		push_object.shaders = parameter.shaders;
		push_object.vertices = parameter.vertices;
		push_object.buffers = parameter.buffers;
		push_object.vao = parameter.vao;
		push_object.vao_index = parameter.vao_index;
		push_object.textures = parameter.textures;
		// callUniforms is for aliasing function of uniform variable storing
		push_object.callUniforms = parameter.callUniforms;
		push_object.geometry_mode = parameter.geometry_mode;
		push_object.geometry_first = parameter.geometry_first;
		push_object.geometry_count = parameter.geometry_count;

		// Position
		if ( typeof parameter.x !== "number" || parameter.x === null ) {
			parameter.x = this.x;
		}
		if ( typeof parameter.y !== "number" || parameter.y === null ) {
			parameter.y = this.y;
		}
		if ( typeof parameter.z !== "number" || parameter.z === null ) {
			parameter.z = this.z;
		}

		// Per milliseconds
		if ( typeof parameter.x_speed !== "number" || parameter.x_speed === null ) {
			parameter.x_speed = this.x_speed;
		}
		if ( typeof parameter.y_speed !== "number" || parameter.y_speed === null ) {
			parameter.y_speed = this.y_speed;
		}
		if ( typeof parameter.z_speed !== "number" || parameter.z_speed === null ) {
			parameter.z_speed = this.z_speed;
		}

		// Use to define rotation origin
		if ( typeof parameter.x_origin !== "number" || parameter.x_origin === null ) {
			parameter.x_origin = this.x_origin;
		}
		if ( typeof parameter.y_origin !== "number" || parameter.y_origin === null ) {
			parameter.y_origin = this.y_origin;
		}
		if ( typeof parameter.z_origin !== "number" || parameter.z_origin === null ) {
			parameter.z_origin = this.z_origin;
		}

		push_object.x = parameter.x;
		push_object.y = parameter.y;
		push_object.z = parameter.z;
		push_object.x_speed = parameter.x_speed;
		push_object.y_speed = parameter.y_speed;
		push_object.z_speed = parameter.z_speed;
		push_object.x_origin = parameter.x_origin;
		push_object.y_origin = parameter.y_origin;
		push_object.z_origin = parameter.z_origin;

		// Scale
		if ( typeof parameter.sx !== "number" || parameter.sx === null ) {
			parameter.sx = this.sx;
		}
		if ( typeof parameter.sy !== "number" || parameter.sy === null ) {
			parameter.sy = this.sy;
		}
		if ( typeof parameter.sz !== "number" || parameter.sz === null ) {
			parameter.sz = this.sz;
		}

		// Per milliseconds
		if ( typeof parameter.sx_speed !== "number" || parameter.sx_speed === null ) {
			parameter.sx_speed = this.sx_speed;
		}
		if ( typeof parameter.sy_speed !== "number" || parameter.sy_speed === null ) {
			parameter.sy_speed = this.sy_speed;
		}
		if ( typeof parameter.sz_speed !== "number" || parameter.sz_speed === null ) {
			parameter.sz_speed = this.sz_speed;
		}

		push_object.sx = parameter.sx;
		push_object.sy = parameter.sy;
		push_object.sz = parameter.sz;
		push_object.sx_speed = parameter.sx_speed;
		push_object.sy_speed = parameter.sy_speed;
		push_object.sz_speed = parameter.sz_speed;

		// Rotation (Actual Degrees or Quaternions)
		// Angle use for Quaternions
		if ( typeof parameter.angle !== "number" || parameter.angle === null ) {
			parameter.angle = this.angle;
		}
		// Actual degrees or normalized vector as axis of rotation
		if ( typeof parameter.rx !== "number" || parameter.rx === null ) {
			parameter.rx = this.rx;
		}
		if ( typeof parameter.ry !== "number" || parameter.ry === null ) {
			parameter.ry = this.ry;
		}
		if ( typeof parameter.rz !== "number" || parameter.rz === null ) {
			parameter.rz = this.rz;
		}

		// Per milliseconds
		if ( typeof parameter.angle_speed !== "number" || parameter.angle_speed === null ) {
			parameter.angle_speed = this.angle_speed;
		}
		if ( typeof parameter.rx_speed !== "number" || parameter.rx_speed === null ) {
			parameter.rx_speed = this.rx_speed;
		}
		if ( typeof parameter.ry_speed !== "number" || parameter.ry_speed === null ) {
			parameter.ry_speed = this.ry_speed;
		}
		if ( typeof parameter.rz_speed !== "number" || parameter.rz_speed === null ) {
			parameter.rz_speed = this.rz_speed;
		}

		push_object.angle = parameter.angle;
		push_object.rx = parameter.rx;
		push_object.ry = parameter.ry;
		push_object.rz = parameter.rz;
		push_object.angle_speed = parameter.angle_speed;
		push_object.rx_speed = parameter.rx_speed;
		push_object.ry_speed = parameter.ry_speed;
		push_object.rz_speed = parameter.rz_speed;


		// Surface relectance specular, diffuse, ambient
		if ( typeof parameter.ks !== "object" || parameter.ks === null ) {
			parameter.ks = this.ks;
		}
		if ( typeof parameter.kd !== "object" || parameter.kd === null ) {
			parameter.kd = this.kd;
		}
		if ( typeof parameter.ka !== "object" || parameter.ka === null ) {
			parameter.ka = this.ka;
		}

		push_object.ks = parameter.ks;
		push_object.kd = parameter.kd;
		push_object.ka = parameter.ka;


		// Length and Multipurpose Parameters
		if ( typeof parameter.x_radius !== "number" || parameter.x_radius === null ) {
			parameter.x_radius = this.x_radius;
		}
		if ( typeof parameter.y_radius !== "number" || parameter.y_radius === null ) {
			parameter.y_radius = this.y_radius;
		}
		if ( typeof parameter.z_radius !== "number" || parameter.z_radius === null ) {
			parameter.z_radius = this.z_radius;
		}

		// Multi (Two) Dimentional Array, e.g Store Array Number and Sequence Number in Use on First
		if ( typeof parameter.sequence !== "object" || parameter.sequence === null ) {
			parameter.sequence = this.sequence;
		}

		// Uni Dimentional Array
		if ( typeof parameter.reserve !== "object" || parameter.reserve === null ) {
			parameter.reserve = this.reserve;
		}

		push_object.x_radius = parameter.x_radius;
		push_object.y_radius = parameter.y_radius;
		push_object.z_radius = parameter.z_radius;
		push_object.sequence = parameter.sequence;
		push_object.reserve = parameter.reserve;

		this.push( push_object );

	};

	self.ArrayObject.prototype.pict = function( parameter ) {
		for ( var i = 0, a = this.length; i < a; i++ ) {
			this[i].pict( parameter );
		}
	};

	self.ArrayObject.prototype.delete = function( index ) {
			this[index] = null;
			this.splice( index, 1 );
	};

	self.ArrayObject.prototype.deleteAll = function() {
		for ( var i = 0, a = this.length; i < a; i++ ) {
			this.delete( this.length - 1 );
		}
	}

	// Z-sort ascending order to draw correctly on 2D (using gl_PointSize)
	// You may use Array.prototype.sort() similar to this function
	self.ArrayObject.prototype.zSort = function( offset ) {
		// Considering the speed, check only undefined or so
		if ( typeof offset === "undefined" ) {
			offset = 1.0;
		}
		var flag = true;
		while( flag ) {
			flag = false;
			for ( var i = 0, a = this.length - 1; i < a; i++ ) {
				if ( ( this[i].z + offset ) - ( this[i + 1].z + offset ) > 0 ) {
					var swap = this[i];
					this[i] = this[i + 1];
					this[i + 1] = swap;
					swap = null;
					flag = true;
				}
			}
		}
	};

	self.ArrayObject.prototype.free = function() {
		// Free objects of Array inheritance
		for ( var i = 0, a = this.length; i < a; i++ ) {
			var index = this.length - 1;
			this[index].free();
			this[index] = null;
			this.pop();
		}

		// Free unique objects
		if ( this.shaders !== null ) {
			for ( var i = 0, a = this.shaders.length; i < a; i++ ) {
				var index = this.shaders.length - 1;
				if ( this.shaders[index].attributes !== null ) {
					for ( var j = 0, b = this.shaders[index].attributes.length; j < b; j++ ) {
						var index_2 = this.shaders[index].attributes.length - 1;
						self.gl.disableVertexAttribArray( this.shaders[index].attributes[index_2] );
						this.shaders[index].attributes[index_2] = null;
						this.shaders[index].attributes.pop();
					}
				}
				this.shaders[index].attributes = null;
				self.gl.deleteProgram( this.shaders[index].program );
				this.shaders[index].program = null;
				this.shaders[index] = null;
				this.shaders.pop();
			}
		}
		this.shaders = null;

		if ( this.vertices !== null ) {
			for ( var i = 0, a = this.vertices.length; i < a; i++ ) {
				this.vertices[this.vertices.length - 1] = null;
				this.vertices.pop();
			}
		}
		this.vertices = null;

		if ( this.buffers !== null ) {
			for ( var i = 0, a = this.buffers.length; i < a; i++ ) {
				var index = this.buffers.length - 1;
				self.gl.deleteBuffer( this.buffers[index] );
				this.buffers[index] = null;
				this.buffers.pop();
			}
		}
		this.buffers = null;

		if ( this.vao !== null ) {
			for ( var i = 0, a = this.vao.length; i < a; i++ ) {
				this.vao[this.vao.length - 1] = null;
				this.vao.pop();
			}
		}
		this.vao = null;

		this.vao_index = null;

		// Multi (Two) Dimentional Array
		if ( this.textures !== null ) {
			for ( var i = 0, a = this.textures.length; i < a; i++ ) {
				var index = this.textures.length - 1;
				if ( this.textures[index] !== null ) {
					for ( var j = 0, b = this.textures[index].length; j < b; j++ ) {
						var index_2 = this.textures[index].length - 1;
						self.gl.deleteTexture( this.textures[index][index_2] );
						this.textures[index][index_2] = null;
						this.textures[index].pop();
					}
				}
				this.textures[index] = null;
				this.textures.pop();
			}
		}
		this.textures = null;

		this.callUniforms = null;

		if ( this.geometry_mode !== null ) {
			for ( var i = 0, a = this.geometry_mode.length; i < a; i++ ) {
				this.geometry_mode[this.geometry_mode.length - 1] = null;
				this.geometry_mode.pop();
			}
		}
		this.geometry_mode = null;

		if ( this.geometry_first !== null ) {
			for ( var i = 0, a = this.geometry_first.length; i < a; i++ ) {
				this.geometry_first[this.geometry_first.length - 1] = null;
				this.geometry_first.pop();
			}
		}
		this.geometry_first = null;

		if ( this.geometry_count !== null ) {
			for ( var i = 0, a = this.geometry_count.length; i < a; i++ ) {
				this.geometry_count[this.geometry_count.length - 1] = null;
				this.geometry_count.pop();
			}
		}
		this.geometry_count = null;

		this.x = null;
		this.y = null;
		this.z = null;
		this.x_speed = null;
		this.y_speed = null;
		this.z_speed = null;
		this.x_origin = null;
		this.y_origin = null;
		this.z_origin = null;

		this.sx = null;
		this.sy = null;
		this.sz = null;
		this.sx_speed = null;
		this.sy_speed = null;
		this.sz_speed = null;

		this.angle = null;
		this.rx = null;
		this.ry = null;
		this.rz = null;
		this.angle_speed = null;
		this.rx_speed = null;
		this.ry_speed = null;
		this.rz_speed = null;

		if ( this.ks !== null ) {
			for ( var i = 0, a = this.ks.length; i < a; i++ ) {
				this.ks[this.ks.length - 1] = null;
				this.ks.pop();
			}
		}
		this.ks = null;

		if ( this.kd !== null ) {
			for ( var i = 0, a = this.kd.length; i < a; i++ ) {
				this.kd[this.kd.length - 1] = null;
				this.kd.pop();
			}
		}
		this.kd = null;

		if ( this.ka !== null ) {
			for ( var i = 0, a = this.ka.length; i < a; i++ ) {
				this.ka[this.ka.length - 1] = null;
				this.ka.pop();
			}
		}
		this.ka = null;

		this.x_radius = null;
		this.y_radius = null;
		this.z_radius = null;

		// Multi (Two) Dimentional Array
		if ( this.sequence !== null ) {
			for ( var i = 0, a = this.sequence.length; i < a; i++ ) {
				var index = this.sequence.length - 1;
				if ( this.sequence[index] !== null ) {
					for ( var j = 0, b = this.sequence[index].length; j < b; j++ ) {
						this.sequence[index][this.sequence[index].length - 1] = null;
						this.sequence[index].pop();
					}
				}
				this.sequence[index] = null;
				this.sequence.pop();
			}
		}
		this.sequence = null;

		// Reserve should be number or string or function, not object or array
		// If you want store object or array in reserve, make free memory process itself
		if ( this.reserve !== null ) {
			for ( var i = 0, a = this.reserve.length; i < a; i++ ) {
				this.reserve[this.reserve.length - 1] = null;
				this.reserve.pop();
			}
		}
		this.reserve = null;

	};


	/**
	 * Texture and readPixels
	 * self.gl.pixelStorei is useful for pixel storing settings before making texture or readPixels
	 */

	// Making Cube Mapped Texture for Sky Box, etc.
	self.textureCubeMapByPath = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			return false;
		}

		if ( typeof parameter.positive_x !== "string" || parameter.positive_x === null ) {
			return false;
		}
		if ( typeof parameter.negative_x !== "string" || parameter.negative_x === null ) {
			return false;
		}
		if ( typeof parameter.positive_y !== "string" || parameter.positive_y === null ) {
			return false;
		}
		if ( typeof parameter.negative_y !== "string" || parameter.negative_y === null ) {
			return false;
		}
		if ( typeof parameter.positive_z !== "string" || parameter.positive_z === null ) {
			return false;
		}
		if ( typeof parameter.negative_z !== "string" || parameter.negative_z === null ) {
			return false;
		}
		if ( typeof parameter.format !== "number" || parameter.format === null ) {
			parameter.format = self.gl.RGBA;
		}
		if ( typeof parameter.type !== "number" || parameter.type === null ) {
			parameter.type = self.gl.UNSIGNED_BYTE;
		}
		if ( typeof parameter.mag_filter !== "number" || parameter.mag_filter === null ) {
			parameter.mag_filter = self.gl.LINEAR;
		}
		if ( typeof parameter.min_filter !== "number" || parameter.min_filter === null ) {
			parameter.min_filter = self.gl.LINEAR_MIPMAP_NEAREST;
		}
		if ( typeof parameter.wrap_s !== "number" || parameter.wrap_s === null ) {
			parameter.wrap_s = self.gl.CLAMP_TO_EDGE;
		}
		if ( typeof parameter.wrap_t !== "number" || parameter.wrap_t === null ) {
			parameter.wrap_t = self.gl.CLAMP_TO_EDGE;
		}
		if ( typeof parameter.use_mipmap !== "boolean" || parameter.use_mipmap === null ) {
			parameter.use_mipmap = true;
		}

		if ( typeof parameter.texture !== "object" || parameter.texture === null ) {
			parameter.texture = self.gl.createTexture();
		}

		// Positive X
		var positive_x = new Image();
		positive_x.onload = function() {
			attachTexture( parameter );
		};
		positive_x.src = parameter.positive_x;

		// Negative X
		var negative_x = new Image();
		negative_x.onload = function() {
			attachTexture( parameter );
		};
		negative_x.src = parameter.negative_x;

		// Positive Y
		var positive_y = new Image();
		positive_y.onload = function() {
			attachTexture( parameter );
		};
		positive_y.src = parameter.positive_y;

		// Negative Y
		var negative_y = new Image();
		negative_y.onload = function() {
			attachTexture( parameter );
		};
		negative_y.src = parameter.negative_y;

		// Positive Z
		var positive_z = new Image();
		positive_z.onload = function() {
			attachTexture( parameter );
		};
		positive_z.src = parameter.positive_z;

		// Negative Z
		var negative_z = new Image();
		negative_z.onload = function() {
			attachTexture( parameter );
		};
		negative_z.src = parameter.negative_z;

		var load_counter = 0;

		// Private Function
		// No need of return because texture is already created
		var attachTexture = function( parameter ) {
			load_counter++;
			if ( load_counter === 6 ) {
				self.gl.bindTexture( self.gl.TEXTURE_CUBE_MAP, parameter.texture );
				self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, parameter.format, parameter.format, parameter.type, positive_x );
				self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, parameter.format, parameter.format, parameter.type, negative_x );
				self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, parameter.format, parameter.format, parameter.type, positive_y );
				self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, parameter.format, parameter.format, parameter.type, negative_y );
				self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, parameter.format, parameter.format, parameter.type, positive_z );
				self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, parameter.format, parameter.format, parameter.type, negative_z );
				self.gl.texParameteri( self.gl.TEXTURE_CUBE_MAP, self.gl.TEXTURE_MAG_FILTER, parameter.mag_filter );
				self.gl.texParameteri( self.gl.TEXTURE_CUBE_MAP, self.gl.TEXTURE_MIN_FILTER, parameter.min_filter );
				self.gl.texParameteri( self.gl.TEXTURE_CUBE_MAP, self.gl.TEXTURE_WRAP_S, parameter.wrap_s );
				self.gl.texParameteri( self.gl.TEXTURE_CUBE_MAP, self.gl.TEXTURE_WRAP_T, parameter.wrap_t );

				if ( parameter.use_mipmap ) {
					self.gl.generateMipmap( self.gl.TEXTURE_CUBE_MAP );
				}

				self.gl.bindTexture( self.gl.TEXTURE_2D, null );
			}
		}

		return parameter.texture;

	};


	self.textureCubeMapByPixels = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			return false;
		}

		if ( typeof parameter.positive_x !== "object" || parameter.positive_x === null ) {
			return false;
		}
		if ( typeof parameter.negative_x !== "object" || parameter.negative_x === null ) {
			return false;
		}
		if ( typeof parameter.positive_y !== "object" || parameter.positive_y === null ) {
			return false;
		}
		if ( typeof parameter.negative_y !== "object" || parameter.negative_y === null ) {
			return false;
		}
		if ( typeof parameter.positive_z !== "object" || parameter.positive_z === null ) {
			return false;
		}
		if ( typeof parameter.negative_z !== "object" || parameter.negative_z === null ) {
			return false;
		}
		if ( typeof parameter.width !== "number" || parameter.width === null ) {
			parameter.width = 256;
		}
		if ( typeof parameter.height !== "number" || parameter.height === null ) {
			parameter.height = 256;
		}
		if ( typeof parameter.format !== "number" || parameter.format === null ) {
			parameter.format = self.gl.RGBA;
		}
		if ( typeof parameter.type !== "number" || parameter.type === null ) {
			parameter.type = self.gl.UNSIGNED_BYTE;
		}
		if ( typeof parameter.mag_filter !== "number" || parameter.mag_filter === null ) {
			parameter.mag_filter = self.gl.LINEAR;
		}
		if ( typeof parameter.min_filter !== "number" || parameter.min_filter === null ) {
			parameter.min_filter = self.gl.LINEAR_MIPMAP_NEAREST;
		}
		if ( typeof parameter.wrap_s !== "number" || parameter.wrap_s === null ) {
			parameter.wrap_s = self.gl.CLAMP_TO_EDGE;
		}
		if ( typeof parameter.wrap_t !== "number" || parameter.wrap_t === null ) {
			parameter.wrap_t = self.gl.CLAMP_TO_EDGE;
		}
		if ( typeof parameter.use_mipmap !== "boolean" || parameter.use_mipmap === null ) {
			parameter.use_mipmap = true;
		}

		if ( typeof parameter.texture !== "object" || parameter.texture === null ) {
			parameter.texture = self.gl.createTexture();
		}

		self.gl.bindTexture( self.gl.TEXTURE_CUBE_MAP, parameter.texture );
		self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, parameter.format, parameter.width, parameter.height, 0, parameter.format, parameter.type, parameter.positive_x );
		self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, parameter.format, parameter.width, parameter.height, 0, parameter.format, parameter.type, parameter.negative_x );
		self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, parameter.format, parameter.width, parameter.height, 0, parameter.format, parameter.type, parameter.positive_y );
		self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, parameter.format, parameter.width, parameter.height, 0, parameter.format, parameter.type, parameter.negative_y );
		self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, parameter.format, parameter.width, parameter.height, 0, parameter.format, parameter.type, parameter.positive_z );
		self.gl.texImage2D( self.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, parameter.format, parameter.width, parameter.height, 0, parameter.format, parameter.type, parameter.negative_z );

		self.gl.texParameteri( self.gl.TEXTURE_CUBE_MAP, self.gl.TEXTURE_MAG_FILTER, parameter.mag_filter );
		self.gl.texParameteri( self.gl.TEXTURE_CUBE_MAP, self.gl.TEXTURE_MIN_FILTER, parameter.min_filter );
		self.gl.texParameteri( self.gl.TEXTURE_CUBE_MAP, self.gl.TEXTURE_WRAP_S, parameter.wrap_s );
		self.gl.texParameteri( self.gl.TEXTURE_CUBE_MAP, self.gl.TEXTURE_WRAP_T, parameter.wrap_t );

		if ( parameter.use_mipmap ) {
			self.gl.generateMipmap( self.gl.TEXTURE_CUBE_MAP );
		}

		self.gl.bindTexture( self.gl.TEXTURE_2D, null );

		return parameter.texture;

	};


	// Making Texture by URL path
	self.texture2DByPath = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			return false;
		}

		if ( typeof parameter.url !== "string" || parameter.url === null ) {
			return false;
		}
		if ( typeof parameter.format !== "number" || parameter.format === null ) {
			parameter.format = self.gl.RGBA;
		}
		if ( typeof parameter.type !== "number" || parameter.type === null ) {
			parameter.type = self.gl.UNSIGNED_BYTE;
		}
		if ( typeof parameter.mag_filter !== "number" || parameter.mag_filter === null ) {
			parameter.mag_filter = self.gl.LINEAR;
		}
		if ( typeof parameter.min_filter !== "number" || parameter.min_filter === null ) {
			parameter.min_filter = self.gl.LINEAR_MIPMAP_NEAREST;
		}
		if ( typeof parameter.wrap_s !== "number" || parameter.wrap_s === null ) {
			parameter.wrap_s = self.gl.REPEAT;
		}
		if ( typeof parameter.wrap_t !== "number" || parameter.wrap_t === null ) {
			parameter.wrap_t = self.gl.REPEAT;
		}
		if ( typeof parameter.use_mipmap !== "boolean" || parameter.use_mipmap === null ) {
			parameter.use_mipmap = true;
		}

		if ( typeof parameter.texture !== "object" || parameter.texture === null ) {
			parameter.texture = self.gl.createTexture();
		}

		parameter.image = new Image();
		parameter.image.onload = function() {
			self.handleTexture2DLoaded( parameter );
		};
		parameter.image.src = parameter.url;

		return parameter.texture;
	};


	// Image onload function for texture2DByPath
	self.handleTexture2DLoaded = function( parameter ) {
		self.gl.bindTexture( self.gl.TEXTURE_2D, parameter.texture );
		self.gl.texImage2D( self.gl.TEXTURE_2D, 0, parameter.format, parameter.format, parameter.type, parameter.image );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, parameter.mag_filter );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, parameter.min_filter );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_S, parameter.wrap_s );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_T, parameter.wrap_t );

		if ( parameter.use_mipmap ) {
			self.gl.generateMipmap( self.gl.TEXTURE_2D );
		}

		self.gl.bindTexture( self.gl.TEXTURE_2D, null );
	};


	// Making Texture by Pixels Array
	self.texture2DByPixels = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			return false;
		}

		if ( typeof parameter.pixels !== "object" || parameter.pixels === null ) {
			return false;
		}
		if ( typeof parameter.width !== "number" || parameter.width === null ) {
			parameter.width = 256;
		}
		if ( typeof parameter.height !== "number" || parameter.height === null ) {
			parameter.height = 256;
		}
		if ( typeof parameter.format !== "number" || parameter.format === null ) {
			parameter.format = self.gl.RGBA;
		}
		if ( typeof parameter.type !== "number" || parameter.type === null ) {
			parameter.type = self.gl.UNSIGNED_BYTE;
		}
		if ( typeof parameter.mag_filter !== "number" || parameter.mag_filter === null ) {
			parameter.mag_filter = self.gl.LINEAR;
		}
		if ( typeof parameter.min_filter !== "number" || parameter.min_filter === null ) {
			parameter.min_filter = self.gl.LINEAR_MIPMAP_NEAREST;
		}
		if ( typeof parameter.wrap_s !== "number" || parameter.wrap_s === null ) {
			parameter.wrap_s = self.gl.REPEAT;
		}
		if ( typeof parameter.wrap_t !== "number" || parameter.wrap_t === null ) {
			parameter.wrap_t = self.gl.REPEAT;
		}
		if ( typeof parameter.use_mipmap !== "boolean" || parameter.use_mipmap === null ) {
			parameter.use_mipmap = true;
		}

		if ( typeof parameter.texture !== "object" || parameter.texture === null ) {
			parameter.texture = self.gl.createTexture();
		}

		self.gl.bindTexture( self.gl.TEXTURE_2D, parameter.texture );
		self.gl.texImage2D( self.gl.TEXTURE_2D, 0, parameter.format, parameter.width, parameter.height, 0, parameter.format, parameter.type, parameter.pixels );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, parameter.mag_filter );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, parameter.min_filter );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_S, parameter.wrap_s );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_T, parameter.wrap_t );

		if ( parameter.use_mipmap ) {
			self.gl.generateMipmap( self.gl.TEXTURE_2D );
		}

		self.gl.bindTexture( self.gl.TEXTURE_2D, null );

		return parameter.texture;
	};


	// To Attach texture to framebuffer. Therefore, you can not use mipmap because of active texture
	self.makeEmptyTexture2D = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}

		if ( typeof parameter.width !== "number" || parameter.width === null ) {
			parameter.width = 256;
		}
		if ( typeof parameter.height !== "number" || parameter.height === null ) {
			parameter.height = 256;
		}
		if ( typeof parameter.format !== "number" || parameter.format === null ) {
			parameter.format = self.gl.RGBA;
		}
		if ( typeof parameter.type !== "number" || parameter.type === null ) {
			parameter.type = self.gl.UNSIGNED_BYTE;
		}
		if ( typeof parameter.mag_filter !== "number" || parameter.mag_filter === null ) {
			parameter.mag_filter = self.gl.LINEAR;
		}
		if ( typeof parameter.min_filter !== "number" || parameter.min_filter === null ) {
			parameter.min_filter = self.gl.LINEAR;
		}
		if ( typeof parameter.wrap_s !== "number" || parameter.wrap_s === null ) {
			parameter.wrap_s = self.gl.REPEAT;
		}
		if ( typeof parameter.wrap_t !== "number" || parameter.wrap_t === null ) {
			parameter.wrap_t = self.gl.REPEAT;
		}

		if ( typeof parameter.texture !== "object" || parameter.texture === null ) {
			parameter.texture = self.gl.createTexture();
		}

		self.gl.bindTexture( self.gl.TEXTURE_2D, parameter.texture );
		self.gl.texImage2D( self.gl.TEXTURE_2D, 0, parameter.format, parameter.width, parameter.height, 0, parameter.format, parameter.type, null );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, parameter.mag_filter );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, parameter.min_filter );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_S, parameter.wrap_s );
		self.gl.texParameteri( self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_T, parameter.wrap_t );

		self.gl.bindTexture( self.gl.TEXTURE_2D, null );

		return parameter.texture;
	};


	// Define viewport after bind this frame buffer when rendering
	self.makeFramebufferToTexture2D = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			return false;
		}

		if ( typeof parameter.texture !== "object" || parameter.texture === null ) {
			return false;
		}
		if ( typeof parameter.format !== "number" || parameter.format === null ) {
			parameter.format = self.gl.COLOR_ATTACHMENT0;
		}
		if ( typeof parameter.framebuffer !== "object" || parameter.framebuffer === null ) {
			parameter.framebuffer = self.gl.createFramebuffer();
		}

		self.gl.bindFramebuffer( self.gl.FRAMEBUFFER, parameter.framebuffer );
		self.gl.bindTexture( self.gl.TEXTURE_2D, parameter.texture );
		self.gl.framebufferTexture2D( self.gl.FRAMEBUFFER, parameter.format, self.gl.TEXTURE_2D, parameter.texture, 0 );
		self.gl.bindTexture( self.gl.TEXTURE_2D, null );
		self.gl.bindFramebuffer( self.gl.FRAMEBUFFER, null );

		return parameter.framebuffer;
	};


	self.readRGBAPixelsByte = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}

		// If Default, The Same As Canvas Size
		if ( typeof parameter.width !== "number" || parameter.width === null ) {
			parameter.width = self.gl.drawingBufferWidth;
		}
		if ( typeof parameter.height !== "number" || parameter.height === null ) {
			parameter.height = self.gl.drawingBufferHeight;
		}

		// Unsigned Byte Array
		var pixels = new Uint8Array( parameter.width * parameter.height * 4 );
		self.gl.readPixels( 0, 0, parameter.width, parameter.height, self.gl.RGBA, self.gl.UNSIGNED_BYTE, pixels );
		return pixels;
	};


	self.readRGBAPixelsShort = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}

		// If Default, The Same As Canvas Size
		if ( typeof parameter.width !== "number" || parameter.width === null ) {
			parameter.width = self.gl.drawingBufferWidth;
		}
		if ( typeof parameter.height !== "number" || parameter.height === null ) {
			parameter.height = self.gl.drawingBufferHeight;
		}

		// Unsigned Short Array
		var pixels = new Uint16Array( parameter.width * parameter.height );
		self.gl.readPixels( 0, 0, parameter.width, parameter.height, self.gl.RGBA, self.gl.UNSIGNED_SHORT_4_4_4_4, pixels );
		return pixels;
	};


	/**
	 * Render and Frame Buffer Making
	 */

	self.makeRenderbuffer = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			parameter = {};
		}

		if ( typeof parameter.width !== "number" || parameter.width === null ) {
			parameter.width = 256;
		}
		if ( typeof parameter.height !== "number" || parameter.height === null ) {
			parameter.height = 256;
		}
		if ( typeof parameter.format !== "number" || parameter.format === null ) {
			parameter.format = self.gl.RGBA4;
		}

		parameter.renderbuffer = self.gl.createRenderbuffer();
		self.gl.bindRenderbuffer( self.gl.RENDERBUFFER, parameter.renderbuffer );
		self.gl.renderbufferStorage( self.gl.RENDERBUFFER, parameter.format, parameter.width, parameter.height );
		self.gl.bindRenderbuffer( self.gl.RENDERBUFFER, null );

		return parameter.renderbuffer;
	};


	// Define viewport after bind this frame buffer when rendering
	// To use gl.ReadPixels
	self.makeFramebufferToRenderbuffer = function( parameter ) {
		if ( typeof parameter !== "object" || parameter === null ) {
			return false;
		}

		if ( typeof parameter.renderbuffer !== "object" || parameter.renderbuffer === null ) {
			return false;
		}
		if ( typeof parameter.format !== "number" || parameter.format === null ) {
			parameter.format = self.gl.COLOR_ATTACHMENT0;
		}
		if ( typeof parameter.framebuffer !== "object" || parameter.framebuffer === null ) {
			parameter.framebuffer = self.gl.createFramebuffer();
		}

		self.gl.bindFramebuffer( self.gl.FRAMEBUFFER, parameter.framebuffer );
		self.gl.bindRenderbuffer( self.gl.RENDERBUFFER, parameter.renderbuffer );
		self.gl.framebufferRenderbuffer( self.gl.FRAMEBUFFER, parameter.format, self.gl.RENDERBUFFER, parameter.renderbuffer );
		self.gl.bindRenderbuffer( self.gl.RENDERBUFFER, null );
		self.gl.bindFramebuffer( self.gl.FRAMEBUFFER, null );

		return parameter.framebuffer;
	};


	self.makeFramebuffer = function() {
		var framebuffer = self.gl.createFramebuffer();
		return framebuffer;
	};

};


var SENORUTL = SENORUTL || {};

/**
 * Constants
 */

SENORUTL.M_PI = 3.14159265358979323846;

SENORUTL.RAD_PER_ONE_DEG = (2.0 * SENORUTL.M_PI) / 360.0;
SENORUTL.DEG_PER_ONE_RAD = 360.0 / (2.0 * SENORUTL.M_PI);

/* Fundamental Vector Funcs */

SENORUTL.normalizeVec3 = function( vec3_a ) {
	var vec3_b = [];
	var length = Math.sqrt(
		vec3_a[0] * vec3_a[0] +
		vec3_a[1] * vec3_a[1] +
		vec3_a[2] * vec3_a[2]
	);
	if ( 0.0 === length ) {
		return vec3_b;
	}
	vec3_b[0] = vec3_a[0] / length;
	vec3_b[1] = vec3_a[1] / length;
	vec3_b[2] = vec3_a[2] / length;

	return vec3_b;
};


SENORUTL.dotProductVec3 = function( vec3_a, vec3_b ) {
	var dot = vec3_a[0] * vec3_b[0] + vec3_a[1] * vec3_b[1] + vec3_a[2] * vec3_b[2];

	return dot;
};


SENORUTL.crossProductVec3 = function( vec3_a, vec3_b ) {
	var x = vec3_a[1] * vec3_b[2] - vec3_a[2] * vec3_b[1];
	var y = vec3_a[2] * vec3_b[0] - vec3_a[0] * vec3_b[2];
	var z = vec3_a[0] * vec3_b[1] - vec3_a[1] * vec3_b[0];
	var vec3 = [x, y, z];

	return vec3;
};


/*
 * Fundamental Matrix Funcs
 * USE COLUMN MAJOR ORDER FOR REFERENCE! HARD CORDED ARRAY IS ROW ORDER THOUGH!
 */

SENORUTL.getAllZeroMat3 = function() {
	var mat3 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0];

	return mat3;
};


SENORUTL.getIdentityMat3 = function() {
	var mat3 = [
		1.0, 0.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 0.0, 1.0];

	return mat3;
};


/**
 * Be cautious that these are row order because of array
 * But OpenGL and its tutorial ordinary uses column order
 */

SENORUTL.getAllZeroMat4 = function() {
	var mat4 = [
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0];

	return mat4;
};


SENORUTL.getIdentityMat4 = function() {
	var mat4 = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0];

	return mat4;
};


SENORUTL.multiplyMat4 = function( mat4_a, mat4_b ) {
	var mat4_c = SENORUTL.getAllZeroMat4();
	var index = 0;
	for ( var column = 0; column < 4; column++ ) {
		for ( var row = 0; row < 4; row++ ) {
			var sum = 0.0;
			for ( var i = 0; i < 4; i++ ) {
				sum += mat4_a[i + column * 4] * mat4_b[row + i * 4];
			}
			mat4_c[index] = sum;
			index++;
		}
	}

	return mat4_c;
};


/* Applying Matrix Funcs */

SENORUTL.translateMat4 = function( vec3 ) {
	var mat4 = SENORUTL.getIdentityMat4();
	mat4[12] = vec3[0];
	mat4[13] = vec3[1];
	mat4[14] = vec3[2];

	return mat4;
};


SENORUTL.scaleMat4 = function( vec3 ) {
	var mat4 = SENORUTL.getIdentityMat4();
	mat4[0] = vec3[0];
	mat4[5] = vec3[1];
	mat4[10] = vec3[2];

	return mat4;
};


SENORUTL.rotateXMat4 = function( degree ) {
	var radian = degree * SENORUTL.RAD_PER_ONE_DEG;
	var mat4 = SENORUTL.getIdentityMat4();
	mat4[5] = Math.cos( radian );
	mat4[6] = Math.sin( radian );
	mat4[9] = -Math.sin( radian );
	mat4[10] = Math.cos( radian );

	return mat4;
};


SENORUTL.rotateYMat4 = function( degree ) {
	var radian = degree * SENORUTL.RAD_PER_ONE_DEG;
	var mat4 = SENORUTL.getIdentityMat4();
	mat4[0] = Math.cos( radian );
	mat4[2] = -Math.sin( radian );
	mat4[8] = Math.sin( radian );
	mat4[10] = Math.cos( radian );

	return mat4;
};


SENORUTL.rotateZMat4 = function( degree ) {
	var radian = degree * SENORUTL.RAD_PER_ONE_DEG;
	var mat4 = SENORUTL.getIdentityMat4();
	mat4[0] = Math.cos( radian );
	mat4[1] = Math.sin( radian );
	mat4[4] = -Math.sin( radian );
	mat4[5] = Math.cos( radian );

	return mat4;
};


/* Other Matrix Funcs */

SENORUTL.perspectiveMat4 = function( fovy, aspect, near, far ) {
	var fovy_by_rad = fovy * SENORUTL.RAD_PER_ONE_DEG;
	var range = Math.tan( fovy_by_rad / 2.0 ) * near;
	var sx = (2.0 * near) / (range * aspect + range * aspect);
	var sy = near / range;
	var sz = -(far + near) / (far - near);
	var pz = -(2.0 * far * near) / (far - near);
	var mat4 = SENORUTL.getAllZeroMat4();
	mat4[0] = sx;
	mat4[5] = sy;
	mat4[10] = sz;
	mat4[11] = -1.0;
	mat4[14] = pz;

	return mat4;
};


/**
 * 'up' means which axis is up on dimention by normalized vector
 * If X is horizontal, Y is up, Z is depth, [0.0, 1.0, 0.0]
 * Be cautious that blender uses Z-up
 */
SENORUTL.makeViewMat4 = function( camera_pos, target_pos, up ) {
	/* Camera Position */
	var reverse = [-camera_pos[0], -camera_pos[1], -camera_pos[2]];
	var camera_pos_mat4 = SENORUTL.translateMat4( reverse );

	/* Make Distance target_pos - camera_pos */
	var distance = [target_pos[0] - camera_pos[0], target_pos[1] - camera_pos[1], target_pos[2] - camera_pos[2]];

	/* Forward Vector *it's middle finger* */
	var forward = SENORUTL.normalizeVec3( distance );

	/* Right Vector *it's thumb* */
	var cross_f_u = SENORUTL.crossProductVec3( forward, up );
	var right = SENORUTL.normalizeVec3( cross_f_u );

	/* Real Up Vector *it's index finger* */
	var cross_r_f = SENORUTL.crossProductVec3( right, forward );
	var real_up = SENORUTL.normalizeVec3( cross_r_f );

	var orient = SENORUTL.getIdentityMat4();
	orient[0] = right[0];
	orient[1] = real_up[0];
	orient[2] = -forward[0];
	orient[4] = right[1];
	orient[5] = real_up[1];
	orient[6] = -forward[1];
	orient[8] = right[2];
	orient[9] = real_up[2];
	orient[10] = -forward[2];

	var result = SENORUTL.multiplyMat4( camera_pos_mat4, orient );

	return result;
};


/* Versor, a quaternion of rotation factor */

/* For Rotation #1 */
SENORUTL.makeVersor = function( a, x, y, z ) {
	var versor = [];
	var rad = SENORUTL.RAD_PER_ONE_DEG * a;
	var vec3 = SENORUTL.normalizeVec3([x, y, z]);
	versor[0] = Math.cos( rad / 2.0 ); /* w */
	versor[1] = Math.sin( rad / 2.0 ) * vec3[0]; /* x */
	versor[2] = Math.sin( rad / 2.0 ) * vec3[1]; /* y */
	versor[3] = Math.sin( rad / 2.0 ) * vec3[2]; /* z */

	return versor;
};


/*For Rotation #2*/
SENORUTL.versorToMat4 = function( versor ) {
	var mat4 = [];
	var w = versor[0];
	var x = versor[1];
	var y = versor[2];
	var z = versor[3];
	mat4[0] = 1.0 - 2.0 * y * y - 2.0 * z * z;
	mat4[1] = 2.0 * x * y + 2.0 * w * z;
	mat4[2] = 2.0 * x * z - 2.0 * w * y;
	mat4[3] = 0.0;
	mat4[4] = 2.0 * x * y - 2.0 * w * z;
	mat4[5] = 1.0 - 2.0 * x * x - 2.0 * z * z;
	mat4[6] = 2.0 * y * z + 2.0 * w * x;
	mat4[7] = 0.0;
	mat4[8] = 2.0 * x * z + 2.0 * w * y;
	mat4[9] = 2.0 * y * z - 2.0 * w * x;
	mat4[10] = 1.0 - 2.0 * x * x - 2.0 * y * y;
	mat4[11] = 0.0;
	mat4[12] = 0.0;
	mat4[13] = 0.0;
	mat4[14] = 0.0;
	mat4[15] = 1.0;

	return mat4;
};


/* 2D Functions */

SENORUTL.scaleMat2 = function( sx, sy ) {
	var mat2 = [
		1.0, 0.0,
		0.0, 1.0];
	mat2[0] = sx;
	mat2[3] = sy;

	return mat2;
};


SENORUTL.rotateMat2 = function( degree ) {
	var radian = degree * SENORUTL.RAD_PER_ONE_DEG;
	var mat2 = [];
	mat2[0] = Math.cos( radian );
	mat2[1] = Math.sin( radian );
	mat2[2] = -Math.sin( radian );
	mat2[3] = Math.cos( radian );

	return mat2;
};


SENORUTL.skewMat2 = function( x_degree, y_degree ) {
	var x_radian = x_degree * SENORUTL.RAD_PER_ONE_DEG;
	var y_radian = y_degree * SENORUTL.RAD_PER_ONE_DEG;
	var mat2 = [
		1.0, 0.0,
		0.0, 1.0];
	mat2[1] = Math.tan( y_radian );
	mat2[2] = Math.tan( x_radian );

	return mat2;
};


/**
 * Convert raw data of Wavefront .obj file in DOM Element to vertices object
 */
SENORUTL.attachObjRaw = function( id ) {
	var strings = document.getElementById( id );
	strings = strings.textContent;
	strings = strings.split(/\n+/);
	var words = '';
	var len = 0;
	var target_arr = [];
	var numbers = [];
	// new Object() Or {}
	var return_object = new Object();
	//console.log(strings);
	for ( var i = 0, a = strings.length; i < a; i++ ) {
		words = strings[i].split(/\s+/);
		//console.log(words);
		switch ( words[0] ) {
			case "#":
				break;

			case "v":
				if ( return_object.geometry ) {
					len = return_object.geometry.vertices.length;
				} else {
					return_object.geometry = new Object();
					// new Array() Or []
					return_object.geometry.vertices = new Array();
					return_object.geometry.index = new Array();
					len = 0;
				}
				return_object.geometry.vertices[len] = new Array();
				for ( var k = 1, c = words.length; k < c; k++ ) {
					return_object.geometry.vertices[len][k - 1] = parseFloat( words[k] );
				}

				break;

			case "vt":
				if ( return_object.texture ) {
					len = return_object.texture.vertices.length;
				} else {
					return_object.texture = new Object();
					// new Array() Or []
					return_object.texture.vertices = new Array();
					return_object.texture.index = new Array();
					len = 0;
				}
				return_object.texture.vertices[len] = new Array();
				for ( var k = 1, c = words.length; k < c; k++ ) {
					return_object.texture.vertices[len][k - 1] = parseFloat( words[k] );
				}

				break;

			case "vn":
				if ( return_object.normal ) {
					len = return_object.normal.vertices.length;
				} else {
					return_object.normal = new Object();
					// new Array() Or []
					return_object.normal.vertices = new Array();
					return_object.normal.index = new Array();
					len = 0;
				}
				return_object.normal.vertices[len] = new Array();
				for ( var k = 1, c = words.length; k < c; k++ ) {
					return_object.normal.vertices[len][k - 1] = parseFloat( words[k] );
				}

				break;

			case "vp":
				if ( ! return_object.parameter ) {
					return_object.parameter = new Array();
				}
				for ( var k = 1, c = words.length; k < c; k++ ) {
					return_object.parameter.push( parseFloat( words[k] ) );
				}

				break;

			case "f":
				for ( var k = 1, c = words.length; k < c; k++ ) {
					numbers = words[k].split(/\//);
					if ( numbers[0] !== "" && typeof numbers[0] !== "undefined" ) {
						return_object.geometry.index.push( parseInt( numbers[0] ) );
					}
					if ( numbers[1] !== "" && typeof numbers[1] !== "undefined" ) {
						return_object.texture.index.push( parseInt( numbers[1] ) );
					}
					if ( numbers[2] !== "" && typeof numbers[2] !== "undefined" ) {
						return_object.normal.index.push( parseInt( numbers[2] ) );
					}
				}

				break;

			default:
				break;
		}
	}

	return return_object;
};


/**
 * Convert raw data of JSON in DOM Element to vertices object
 */
SENORUTL.attachJSONRaw = function( id ) {
	var return_object = document.getElementById( id );
	return_object = JSON.parse( return_object.textContent );

	return return_object;
}


/**
 * Convert vertices object to raw data of JSON
 */
SENORUTL.detachJSONRaw = function( subject ) {
	if ( typeof subject !== "object" || subject === null ) {
		return false;
	}
	var return_string = JSON.stringify( subject );

	return return_string;
}


/**
 * Make Object to store 3d date from JSON raw data in DOM Element
 */
SENORUTL.object3DFromElement = function( id ) {
	var object = document.getElementById( id );
	object = JSON.parse( object.textContent );
	var return_object = SENORUTL.object3D( object );

	return return_object;
};


/**
 * Make Object to store 3d date from vertices object made by 'attach.+Raw' functions
 */
SENORUTL.object3D = function( object ) {
	var return_object = new Object();
	if ( object.geometry ) {
		return_object.geometry = SENORUTL.makeVertices( object.geometry.vertices, object.geometry.index );
	}
	if ( object.texture ) {
		return_object.texture = SENORUTL.makeVertices( object.texture.vertices, object.texture.index );
	}
	if ( object.normal ) {
		return_object.normal = SENORUTL.makeVertices( object.normal.vertices, object.normal.index );
	}
	if ( object.ks ) {
		return_object.ks = object.ks;
	}
	if ( object.kd ) {
		return_object.kd = object.kd;
	}
	if ( object.ka ) {
		return_object.ka = object.ka;
	}
	if ( object.parameter ) {
		return_object.parameter = object.parameter;
	}

	return return_object;
};


/**
 * Utility to make vertices by index system
 */
SENORUTL.makeVertices = function( vertices_arr, index ) {

	var vertices = [];

	// Vertices indices start from 1 in .obj, not 0
	for ( var i = 0; i < index.length; i++ ) {
		vertices = vertices.concat( vertices_arr[index[i] - 1] );
	}

	return vertices;
};


/**
 * Hit Checker for WebGL Object
 * For Speed, omitted null check. Be cautious
 * This Functions is so basic, not considering origin transformation, rotation and scale
 * Hit Check uses much on one process of a loop, so use it for the stem of the object
 */
SENORUTL.hitCheck = function( object_a, object_b ) {
	var diff_x = object_a.x - object_b.x;
	if ( diff_x < 0 ) {
		diff_x = -diff_x;
	}

	var diff_y = object_a.y - object_b.y;
	if ( diff_y < 0 ) {
		diff_y = -diff_y;
	}

	var diff_z = object_a.z - object_b.z;
	if ( diff_z < 0 ) {
		diff_z = -diff_z;
	}

	if ( diff_x < object_a.x_radius + object_b.x_radius && diff_y < object_a.y_radius + object_b.y_radius && diff_z < object_a.z_radius + object_b.z_radius ) {
		return true;
	}

	return false;
};


/**
 * Get Int Random
 * Math.random returns 0 to 1 float
 */
SENORUTL.getRandomInt = function( min, max ) {
	var result = ( Math.round( Math.random() * ( max - min ) ) ) + min;
	return result;
};


/**
 * Get Float Random
 * Math.random returns 0 to 1 float
 */
SENORUTL.getRandomFloat = function( min, max ) {
	var result = ( Math.random() * ( max - min ) ) + min;
	return result;
};
