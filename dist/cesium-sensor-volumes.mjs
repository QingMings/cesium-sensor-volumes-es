import { createPropertyDescriptor as v, createMaterialPropertyDescriptor as me, defined as l, DeveloperError as C, defaultValue as d, Event as Z, Cartesian3 as p, SceneMode as pe, RenderState as q, BlendingState as K, CullFace as ne, Pass as B, Matrix4 as b, BoundingSphere as Q, ShaderSource as re, ShaderProgram as oe, combine as $, destroyObject as L, DrawCommand as U, PrimitiveType as ve, Material as se, Color as W, Buffer as Ce, BufferUsage as we, ComponentDatatype as ae, VertexArray as Se, Matrix3 as F, Quaternion as M, AssociativeArray as j, Property as g, Math as w, MaterialProperty as G, Spherical as y, clone as Ae, CzmlDataSource as ee, DataSourceDisplay as le, TimeInterval as te } from "cesium";
const O = function(e) {
  this._minimumClockAngle = void 0, this._minimumClockAngleSubscription = void 0, this._maximumClockAngle = void 0, this._maximumClockAngleSubscription = void 0, this._innerHalfAngle = void 0, this._innerHalfAngleSubscription = void 0, this._outerHalfAngle = void 0, this._outerHalfAngleSubscription = void 0, this._lateralSurfaceMaterial = void 0, this._lateralSurfaceMaterialSubscription = void 0, this._intersectionColor = void 0, this._intersectionColorSubscription = void 0, this._intersectionWidth = void 0, this._intersectionWidthSubscription = void 0, this._showIntersection = void 0, this._showIntersectionSubscription = void 0, this._radius = void 0, this._radiusSubscription = void 0, this._show = void 0, this._showSubscription = void 0, this._definitionChanged = new Z(), this.merge(d(e, d.EMPTY_OBJECT));
};
Object.defineProperties(O.prototype, {
  /**
   * Gets the event that is raised whenever a new property is assigned.
   * @memberof ConicSensorGraphics.prototype
   *
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    }
  },
  /**
   * Gets or sets the numeric {@link Property} specifying the the cone's minimum clock angle.
   * @memberof ConicSensorGraphics.prototype
   * @type {Property}
   */
  minimumClockAngle: v("minimumClockAngle"),
  /**
   * Gets or sets the numeric {@link Property} specifying the the cone's maximum clock angle.
   * @memberof ConicSensorGraphics.prototype
   * @type {Property}
   */
  maximumClockAngle: v("maximumClockAngle"),
  /**
   * Gets or sets the numeric {@link Property} specifying the the cone's inner half-angle.
   * @memberof ConicSensorGraphics.prototype
   * @type {Property}
   */
  innerHalfAngle: v("innerHalfAngle"),
  /**
   * Gets or sets the numeric {@link Property} specifying the the cone's outer half-angle.
   * @memberof ConicSensorGraphics.prototype
   * @type {Property}
   */
  outerHalfAngle: v("outerHalfAngle"),
  /**
   * Gets or sets the {@link MaterialProperty} specifying the the cone's appearance.
   * @memberof ConicSensorGraphics.prototype
   * @type {MaterialProperty}
   */
  lateralSurfaceMaterial: me("lateralSurfaceMaterial"),
  /**
   * Gets or sets the {@link Color} {@link Property} specifying the color of the line formed by the intersection of the cone and other central bodies.
   * @memberof ConicSensorGraphics.prototype
   * @type {Property}
   */
  intersectionColor: v("intersectionColor"),
  /**
   * Gets or sets the numeric {@link Property} specifying the width of the line formed by the intersection of the cone and other central bodies.
   * @memberof ConicSensorGraphics.prototype
   * @type {Property}
   */
  intersectionWidth: v("intersectionWidth"),
  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the line formed by the intersection of the cone and other central bodies.
   * @memberof ConicSensorGraphics.prototype
   * @type {Property}
   */
  showIntersection: v("showIntersection"),
  /**
   * Gets or sets the numeric {@link Property} specifying the radius of the cone's projection.
   * @memberof ConicSensorGraphics.prototype
   * @type {Property}
   */
  radius: v("radius"),
  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the cone.
   * @memberof ConicSensorGraphics.prototype
   * @type {Property}
   */
  show: v("show")
});
O.prototype.clone = function(e) {
  return l(e) || (e = new O()), e.show = this.show, e.innerHalfAngle = this.innerHalfAngle, e.outerHalfAngle = this.outerHalfAngle, e.minimumClockAngle = this.minimumClockAngle, e.maximumClockAngle = this.maximumClockAngle, e.radius = this.radius, e.showIntersection = this.showIntersection, e.intersectionColor = this.intersectionColor, e.intersectionWidth = this.intersectionWidth, e.lateralSurfaceMaterial = this.lateralSurfaceMaterial, e;
};
O.prototype.merge = function(e) {
  if (!l(e))
    throw new C("source is required.");
  this.show = d(this.show, e.show), this.innerHalfAngle = d(this.innerHalfAngle, e.innerHalfAngle), this.outerHalfAngle = d(this.outerHalfAngle, e.outerHalfAngle), this.minimumClockAngle = d(this.minimumClockAngle, e.minimumClockAngle), this.maximumClockAngle = d(this.maximumClockAngle, e.maximumClockAngle), this.radius = d(this.radius, e.radius), this.showIntersection = d(this.showIntersection, e.showIntersection), this.intersectionColor = d(this.intersectionColor, e.intersectionColor), this.intersectionWidth = d(this.intersectionWidth, e.intersectionWidth), this.lateralSurfaceMaterial = d(this.lateralSurfaceMaterial, e.lateralSurfaceMaterial);
};
const he = `#version 300 es

uniform vec4 u_intersectionColor;
uniform float u_intersectionWidth;

bool inSensorShadow(vec3 coneVertexWC, vec3 pointWC)
{
    // Diagonal matrix from the unscaled ellipsoid space to the scaled space.
    vec3 D = czm_ellipsoidInverseRadii;

    // Sensor vertex in the scaled ellipsoid space
    vec3 q = D * coneVertexWC;
    float qMagnitudeSquared = dot(q, q);
    float test = qMagnitudeSquared - 1.0;

    // Sensor vertex to fragment vector in the ellipsoid's scaled space
    vec3 temp = D * pointWC - q;
    float d = dot(temp, q);

    // Behind silhouette plane and inside silhouette cone
    return (d < -test) && (d / length(temp) < -sqrt(test));
}

vec4 getIntersectionColor()
{
    return u_intersectionColor;
}

float getIntersectionWidth()
{
    return u_intersectionWidth;
}

vec2 sensor2dTextureCoordinates(float sensorRadius, vec3 pointMC)
{
    // (s, t) both in the range [0, 1]
    float t = pointMC.z / sensorRadius;
    float s = 1.0 + (atan(pointMC.y, pointMC.x) / czm_twoPi);
    s = s - floor(s);

    return vec2(s, t);
}
`, ue = `#version 300 es

uniform bool u_showIntersection;
uniform bool u_showThroughEllipsoid;

uniform float u_sensorRadius;
uniform float u_normalDirection;

in vec3 v_positionWC;
in vec3 v_positionEC;
in vec3 v_normalEC;

vec4 getColor(float sensorRadius, vec3 pointEC)
{
    czm_materialInput materialInput;

    vec3 pointMC = (czm_inverseModelView * vec4(pointEC, 1.0)).xyz;
    materialInput.st = sensor2dTextureCoordinates(sensorRadius, pointMC);
    materialInput.str = pointMC / sensorRadius;

    vec3 positionToEyeEC = -v_positionEC;
    materialInput.positionToEyeEC = positionToEyeEC;

    vec3 normalEC = normalize(v_normalEC);
    materialInput.normalEC = u_normalDirection * normalEC;

    czm_material material = czm_getMaterial(materialInput);
    return mix(czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC), vec4(material.diffuse, material.alpha), 0.4);
}

bool isOnBoundary(float value, float epsilon)
{
    float width = getIntersectionWidth();
    float tolerance = width * epsilon;

    float delta = max(abs(dFdx(value)), abs(dFdy(value)));
    float pixels = width * delta;
    float temp = abs(value);
    // There are a couple things going on here.
    // First we test the value at the current fragment to see if it is within the tolerance.
    // We also want to check if the value of an adjacent pixel is within the tolerance,
    // but we don't want to admit points that are obviously not on the surface.
    // For example, if we are looking for "value" to be close to 0, but value is 1 and the adjacent value is 2,
    // then the delta would be 1 and "temp - delta" would be "1 - 1" which is zero even though neither of
    // the points is close to zero.
    return temp < tolerance && temp < pixels || (delta < 10.0 * tolerance && temp - delta < tolerance && temp < pixels);
}

vec4 shade(bool isOnBoundary)
{
    if (u_showIntersection && isOnBoundary)
    {
        return getIntersectionColor();
    }
    return getColor(u_sensorRadius, v_positionEC);
}

float ellipsoidSurfaceFunction(vec3 point)
{
    vec3 scaled = czm_ellipsoidInverseRadii * point;
    return dot(scaled, scaled) - 1.0;
}

void main()
{
    vec3 sensorVertexWC = czm_model[3].xyz;      // (0.0, 0.0, 0.0) in model coordinates
    vec3 sensorVertexEC = czm_modelView[3].xyz;  // (0.0, 0.0, 0.0) in model coordinates

    float ellipsoidValue = ellipsoidSurfaceFunction(v_positionWC);

    // Occluded by the ellipsoid?
    if (!u_showThroughEllipsoid)
    {
        // Discard if in the ellipsoid
        // PERFORMANCE_IDEA: A coarse check for ellipsoid intersection could be done on the CPU first.
        if (ellipsoidValue < 0.0)
        {
            discard;
        }

        // Discard if in the sensor's shadow
        if (inSensorShadow(sensorVertexWC, v_positionWC))
        {
            discard;
        }
    }

    // Discard if not in the sensor's sphere
    // PERFORMANCE_IDEA: We can omit this check if the radius is Number.POSITIVE_INFINITY.
    if (distance(v_positionEC, sensorVertexEC) > u_sensorRadius)
    {
        discard;
    }

    // Notes: Each surface functions should have an associated tolerance based on the floating point error.
    bool isOnEllipsoid = isOnBoundary(ellipsoidValue, czm_epsilon3);
    out_FragColor = shade(isOnEllipsoid);
}
`, ce = `#version 300 es

in vec4 position;
in vec3 normal;

out vec3 v_positionWC;
out vec3 v_positionEC;
out vec3 v_normalEC;

void main()
{
    gl_Position = czm_modelViewProjection * position;
    v_positionWC = (czm_model * position).xyz;
    v_positionEC = (czm_modelView * position).xyz;
    v_normalEC = czm_normal * normal;
}
`, J = {
  position: 0,
  normal: 1
}, ge = 5906376272e3, x = function(e) {
  e = d(e, d.EMPTY_OBJECT), this._pickId = void 0, this._pickPrimitive = d(e._pickPrimitive, this), this._frontFaceColorCommand = new U(), this._backFaceColorCommand = new U(), this._pickCommand = new U(), this._boundingSphere = new Q(), this._boundingSphereWC = new Q(), this._frontFaceColorCommand.primitiveType = ve.TRIANGLES, this._frontFaceColorCommand.boundingVolume = this._boundingSphereWC, this._frontFaceColorCommand.owner = this, this._backFaceColorCommand.primitiveType = this._frontFaceColorCommand.primitiveType, this._backFaceColorCommand.boundingVolume = this._frontFaceColorCommand.boundingVolume, this._backFaceColorCommand.owner = this, this._pickCommand.primitiveType = this._frontFaceColorCommand.primitiveType, this._pickCommand.boundingVolume = this._frontFaceColorCommand.boundingVolume, this._pickCommand.owner = this, this.show = d(e.show, !0), this.showIntersection = d(e.showIntersection, !0), this.showThroughEllipsoid = d(e.showThroughEllipsoid, !1), this._showThroughEllipsoid = this.showThroughEllipsoid, this.modelMatrix = b.clone(d(e.modelMatrix, b.IDENTITY)), this._modelMatrix = new b(), this.radius = d(e.radius, Number.POSITIVE_INFINITY), this._directions = void 0, this._directionsDirty = !1, this.directions = l(e.directions) ? e.directions : [], this.lateralSurfaceMaterial = l(e.lateralSurfaceMaterial) ? e.lateralSurfaceMaterial : se.fromType(se.ColorType), this._lateralSurfaceMaterial = void 0, this._translucent = void 0, this.intersectionColor = W.clone(d(e.intersectionColor, W.WHITE)), this.intersectionWidth = d(e.intersectionWidth, 5), this.id = e.id, this._id = void 0;
  var n = this;
  this._uniforms = {
    u_showThroughEllipsoid: function() {
      return n.showThroughEllipsoid;
    },
    u_showIntersection: function() {
      return n.showIntersection;
    },
    u_sensorRadius: function() {
      return isFinite(n.radius) ? n.radius : ge;
    },
    u_intersectionColor: function() {
      return n.intersectionColor;
    },
    u_intersectionWidth: function() {
      return n.intersectionWidth;
    },
    u_normalDirection: function() {
      return 1;
    }
  }, this._mode = pe.SCENE3D;
};
Object.defineProperties(x.prototype, {
  directions: {
    get: function() {
      return this._directions;
    },
    set: function(e) {
      this._directions = e, this._directionsDirty = !0;
    }
  }
});
const Me = new p(), Ie = new p(), be = new p();
function xe(e) {
  for (var n = e._directions, a = n.length, s = new Float32Array(3 * a), t = isFinite(e.radius) ? e.radius : ge, i = [p.ZERO], o = a - 2, r = a - 1, u = 0; u < a; o = r++, r = u++) {
    var f = p.fromSpherical(n[o], Me), h = p.fromSpherical(n[r], Ie), _ = p.fromSpherical(n[u], be), c = Math.max(p.angleBetween(f, h), p.angleBetween(h, _)), m = t / Math.cos(c * 0.5), A = p.multiplyByScalar(h, m, new p());
    s[r * 3] = A.x, s[r * 3 + 1] = A.y, s[r * 3 + 2] = A.z, i.push(A);
  }
  return Q.fromPoints(i, e._boundingSphere), s;
}
const de = new p();
function ye(e, n) {
  for (var a = xe(e), s = e._directions.length, t = new Float32Array(2 * 3 * 3 * s), i = 0, o = s - 1, r = 0; r < s; o = r++) {
    var u = new p(a[o * 3], a[o * 3 + 1], a[o * 3 + 2]), f = new p(a[r * 3], a[r * 3 + 1], a[r * 3 + 2]), h = p.normalize(p.cross(f, u, de), de);
    t[i++] = 0, t[i++] = 0, t[i++] = 0, t[i++] = h.x, t[i++] = h.y, t[i++] = h.z, t[i++] = f.x, t[i++] = f.y, t[i++] = f.z, t[i++] = h.x, t[i++] = h.y, t[i++] = h.z, t[i++] = u.x, t[i++] = u.y, t[i++] = u.z, t[i++] = h.x, t[i++] = h.y, t[i++] = h.z;
  }
  var _ = Ce.createVertexBuffer({
    context: n,
    typedArray: new Float32Array(t),
    usage: we.STATIC_DRAW
  }), c = 2 * 3 * Float32Array.BYTES_PER_ELEMENT, m = [{
    index: J.position,
    vertexBuffer: _,
    componentsPerAttribute: 3,
    componentDatatype: ae.FLOAT,
    offsetInBytes: 0,
    strideInBytes: c
  }, {
    index: J.normal,
    vertexBuffer: _,
    componentsPerAttribute: 3,
    componentDatatype: ae.FLOAT,
    offsetInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
    strideInBytes: c
  }];
  return new Se({
    context: n,
    attributes: m
  });
}
x.prototype.update = function(e) {
  if (this._mode = e.mode, !(!this.show || this._mode !== pe.SCENE3D)) {
    var n = e.context, a = e.commandList;
    if (this.radius < 0)
      throw new C("this.radius must be greater than or equal to zero.");
    if (!l(this.lateralSurfaceMaterial))
      throw new C("this.lateralSurfaceMaterial must be defined.");
    var s = this.lateralSurfaceMaterial.isTranslucent();
    if (this._showThroughEllipsoid !== this.showThroughEllipsoid || !l(this._frontFaceColorCommand.renderState) || this._translucent !== s) {
      this._showThroughEllipsoid = this.showThroughEllipsoid, this._translucent = s;
      var t;
      s ? (t = q.fromCache({
        depthTest: {
          // This would be better served by depth testing with a depth buffer that does not
          // include the ellipsoid depth - or a g-buffer containing an ellipsoid mask
          // so we can selectively depth test.
          enabled: !this.showThroughEllipsoid
        },
        depthMask: !1,
        blending: K.ALPHA_BLEND,
        cull: {
          enabled: !0,
          face: ne.BACK
        }
      }), this._frontFaceColorCommand.renderState = t, this._frontFaceColorCommand.pass = B.TRANSLUCENT, t = q.fromCache({
        depthTest: {
          enabled: !this.showThroughEllipsoid
        },
        depthMask: !1,
        blending: K.ALPHA_BLEND,
        cull: {
          enabled: !0,
          face: ne.FRONT
        }
      }), this._backFaceColorCommand.renderState = t, this._backFaceColorCommand.pass = B.TRANSLUCENT, t = q.fromCache({
        depthTest: {
          enabled: !this.showThroughEllipsoid
        },
        depthMask: !1,
        blending: K.ALPHA_BLEND
      }), this._pickCommand.renderState = t) : (t = q.fromCache({
        depthTest: {
          enabled: !0
        },
        depthMask: !0
      }), this._frontFaceColorCommand.renderState = t, this._frontFaceColorCommand.pass = B.OPAQUE, t = q.fromCache({
        depthTest: {
          enabled: !0
        },
        depthMask: !0
      }), this._pickCommand.renderState = t);
    }
    var i = this._directionsDirty;
    if (i) {
      this._directionsDirty = !1, this._va = this._va && this._va.destroy();
      var o = this._directions;
      o && o.length >= 3 && (this._frontFaceColorCommand.vertexArray = ye(this, n), this._backFaceColorCommand.vertexArray = this._frontFaceColorCommand.vertexArray, this._pickCommand.vertexArray = this._frontFaceColorCommand.vertexArray);
    }
    if (l(this._frontFaceColorCommand.vertexArray)) {
      var r = e.passes, u = !b.equals(this.modelMatrix, this._modelMatrix);
      u && b.clone(this.modelMatrix, this._modelMatrix), (i || u) && Q.transform(this._boundingSphere, this.modelMatrix, this._boundingSphereWC), this._frontFaceColorCommand.modelMatrix = this.modelMatrix, this._backFaceColorCommand.modelMatrix = this._frontFaceColorCommand.modelMatrix, this._pickCommand.modelMatrix = this._frontFaceColorCommand.modelMatrix;
      var f = this._lateralSurfaceMaterial !== this.lateralSurfaceMaterial;
      if (this._lateralSurfaceMaterial = this.lateralSurfaceMaterial, this._lateralSurfaceMaterial.update(n), r.render) {
        var h = this._frontFaceColorCommand, _ = this._backFaceColorCommand;
        if (f || !l(h.shaderProgram)) {
          var c = new re({
            sources: [he, this._lateralSurfaceMaterial.shaderSource, ue]
          });
          h.shaderProgram = oe.replaceCache({
            context: n,
            shaderProgram: h.shaderProgram,
            vertexShaderSource: ce,
            fragmentShaderSource: c,
            attributeLocations: J
          }), h.uniformMap = $(this._uniforms, this._lateralSurfaceMaterial._uniforms), _.shaderProgram = h.shaderProgram, _.uniformMap = $(this._uniforms, this._lateralSurfaceMaterial._uniforms), _.uniformMap.u_normalDirection = function() {
            return -1;
          };
        }
        s ? a.push(this._backFaceColorCommand, this._frontFaceColorCommand) : a.push(this._frontFaceColorCommand);
      }
      if (r.pick) {
        var m = this._pickCommand;
        if ((!l(this._pickId) || this._id !== this.id) && (this._id = this.id, this._pickId = this._pickId && this._pickId.destroy(), this._pickId = n.createPickId({
          primitive: this._pickPrimitive,
          id: this.id
        })), f || !l(m.shaderProgram)) {
          var A = new re({
            sources: [he, this._lateralSurfaceMaterial.shaderSource, ue],
            pickColorQualifier: "uniform"
          });
          m.shaderProgram = oe.replaceCache({
            context: n,
            shaderProgram: m.shaderProgram,
            vertexShaderSource: ce,
            fragmentShaderSource: A,
            attributeLocations: J
          });
          var R = this, N = {
            // eslint-disable-next-line camelcase
            czm_pickColor: function() {
              return R._pickId.color;
            }
          };
          m.uniformMap = $($(this._uniforms, this._lateralSurfaceMaterial._uniforms), N);
        }
        m.pass = s ? B.TRANSLUCENT : B.OPAQUE, a.push(m);
      }
    }
  }
};
x.prototype.isDestroyed = function() {
  return !1;
};
x.prototype.destroy = function() {
  return this._frontFaceColorCommand.vertexArray = this._frontFaceColorCommand.vertexArray && this._frontFaceColorCommand.vertexArray.destroy(), this._frontFaceColorCommand.shaderProgram = this._frontFaceColorCommand.shaderProgram && this._frontFaceColorCommand.shaderProgram.destroy(), this._pickCommand.shaderProgram = this._pickCommand.shaderProgram && this._pickCommand.shaderProgram.destroy(), this._pickId = this._pickId && this._pickId.destroy(), L(this);
};
function I(e, n, a) {
  var s = n[e.id];
  if (l(s)) {
    var t = s.primitive;
    a.remove(t), t.isDestroyed() || t.destroy(), delete n[e.id];
  }
}
const Ee = W.WHITE, Te = 1, Pe = Number.POSITIVE_INFINITY, Ve = new F(), We = new p(), Oe = new M();
function V(e, n, a, s) {
  var t = n[e];
  l(t) || (t = new y(), n[e] = t), t.clock = a, t.cone = s, t.magnitude = 1;
}
function He(e, n, a, s, t) {
  var i = e.directions, o, r = 0, u = w.toRadians(2);
  if (n === 0 && a === w.TWO_PI)
    for (o = 0; o < w.TWO_PI; o += u)
      V(r++, i, o, t);
  else {
    for (o = n; o < a; o += u)
      V(r++, i, o, t);
    if (V(r++, i, a, t), s) {
      for (o = a; o > n; o -= u)
        V(r++, i, o, s);
      V(r++, i, n, s);
    } else
      V(r++, i, a, 0);
  }
  i.length = r, e.directions = i;
}
const E = function(e, n) {
  if (!l(e))
    throw new C("scene is required.");
  if (!l(n))
    throw new C("entityCollection is required.");
  n.collectionChanged.addEventListener(E.prototype._onCollectionChanged, this), this._scene = e, this._primitives = e.primitives, this._entityCollection = n, this._hash = {}, this._entitiesToVisualize = new j(), this._onCollectionChanged(n, n.values, [], []);
};
E.prototype.update = function(e) {
  if (!l(e))
    throw new C("time is required.");
  for (var n = this._entitiesToVisualize.values, a = this._hash, s = this._primitives, t = 0, i = n.length; t < i; t++) {
    var o = n[t], r = o._conicSensor, u, f, h = a[o.id], _ = o.isShowing && o.isAvailable(e) && g.getValueOrDefault(r._show, e, !0);
    if (_ && (u = g.getValueOrUndefined(o._position, e, We), f = g.getValueOrUndefined(o._orientation, e, Oe), _ = l(u) && l(f)), !_) {
      l(h) && (h.primitive.show = !1);
      continue;
    }
    var c = l(h) ? h.primitive : void 0;
    l(c) || (c = new x(), c.id = o, s.add(c), h = {
      primitive: c,
      position: void 0,
      orientation: void 0,
      minimumClockAngle: void 0,
      maximumClockAngle: void 0,
      innerHalfAngle: void 0,
      outerHalfAngle: void 0
    }, a[o.id] = h), (!p.equals(u, h.position) || !M.equals(f, h.orientation)) && (b.fromRotationTranslation(F.fromQuaternion(f, Ve), u, c.modelMatrix), h.position = p.clone(u, h.position), h.orientation = M.clone(f, h.orientation)), c.show = !0;
    var m = g.getValueOrDefault(r._minimumClockAngle, e, 0), A = g.getValueOrDefault(r._maximumClockAngle, e, w.TWO_PI), R = g.getValueOrDefault(r._innerHalfAngle, e, 0), N = g.getValueOrDefault(r._outerHalfAngle, e, Math.PI);
    (m !== h.minimumClockAngle || A !== h.maximumClockAngle || R !== h.innerHalfAngle || N !== h.outerHalfAngle) && (He(c, m, A, R, N), h.innerHalfAngle = R, h.maximumClockAngle = A, h.outerHalfAngle = N, h.minimumClockAngle = m), c.radius = g.getValueOrDefault(r._radius, e, Pe), c.lateralSurfaceMaterial = G.getValue(e, r._lateralSurfaceMaterial, c.lateralSurfaceMaterial), c.intersectionColor = g.getValueOrClonedDefault(r._intersectionColor, e, Ee, c.intersectionColor), c.intersectionWidth = g.getValueOrDefault(r._intersectionWidth, e, Te);
  }
  return !0;
};
E.prototype.isDestroyed = function() {
  return !1;
};
E.prototype.destroy = function() {
  for (var e = this._entitiesToVisualize.values, n = this._hash, a = this._primitives, s = e.length - 1; s > -1; s--)
    I(e[s], n, a);
  return L(this);
};
E.prototype._onCollectionChanged = function(e, n, a, s) {
  var t, i, o = this._entitiesToVisualize, r = this._hash, u = this._primitives;
  for (t = n.length - 1; t > -1; t--)
    i = n[t], l(i._conicSensor) && l(i._position) && l(i._orientation) && o.set(i.id, i);
  for (t = s.length - 1; t > -1; t--)
    i = s[t], l(i._conicSensor) && l(i._position) && l(i._orientation) ? o.set(i.id, i) : (I(i, r, u), o.remove(i.id));
  for (t = a.length - 1; t > -1; t--)
    i = a[t], I(i, r, u), o.remove(i.id);
};
const H = function(e) {
  this._directions = void 0, this._directionsSubscription = void 0, this._lateralSurfaceMaterial = void 0, this._lateralSurfaceMaterialSubscription = void 0, this._intersectionColor = void 0, this._intersectionColorSubscription = void 0, this._intersectionWidth = void 0, this._intersectionWidthSubscription = void 0, this._showIntersection = void 0, this._showIntersectionSubscription = void 0, this._radius = void 0, this._radiusSubscription = void 0, this._show = void 0, this._showSubscription = void 0, this._definitionChanged = new Z(), this.merge(d(e, d.EMPTY_OBJECT));
};
Object.defineProperties(H.prototype, {
  /**
   * Gets the event that is raised whenever a new property is assigned.
   * @memberof CustomPatternSensorGraphics.prototype
   *
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    }
  },
  /**
   * A {@link Property} which returns an array of {@link Spherical} instances representing the sensor's projection.
   * @memberof CustomPatternSensorGraphics.prototype
   * @type {Property}
   */
  directions: v("directions"),
  /**
   * Gets or sets the {@link MaterialProperty} specifying the the sensor's appearance.
   * @memberof CustomPatternSensorGraphics.prototype
   * @type {MaterialProperty}
   */
  lateralSurfaceMaterial: me("lateralSurfaceMaterial"),
  /**
   * Gets or sets the {@link Color} {@link Property} specifying the color of the line formed by the intersection of the sensor and other central bodies.
   * @memberof CustomPatternSensorGraphics.prototype
   * @type {Property}
   */
  intersectionColor: v("intersectionColor"),
  /**
   * Gets or sets the numeric {@link Property} specifying the width of the line formed by the intersection of the sensor and other central bodies.
   * @memberof CustomPatternSensorGraphics.prototype
   * @type {Property}
   */
  intersectionWidth: v("intersectionWidth"),
  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the line formed by the intersection of the sensor and other central bodies.
   * @memberof CustomPatternSensorGraphics.prototype
   * @type {Property}
   */
  showIntersection: v("showIntersection"),
  /**
   * Gets or sets the numeric {@link Property} specifying the radius of the sensor's projection.
   * @memberof CustomPatternSensorGraphics.prototype
   * @type {Property}
   */
  radius: v("radius"),
  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the sensor.
   * @memberof CustomPatternSensorGraphics.prototype
   * @type {Property}
   */
  show: v("show")
});
H.prototype.clone = function(e) {
  return l(e) || (e = new H()), e.directions = this.directions, e.radius = this.radius, e.show = this.show, e.showIntersection = this.showIntersection, e.intersectionColor = this.intersectionColor, e.intersectionWidth = this.intersectionWidth, e.lateralSurfaceMaterial = this.lateralSurfaceMaterial, e;
};
H.prototype.merge = function(e) {
  if (!l(e))
    throw new C("source is required.");
  this.directions = d(this.directions, e.directions), this.radius = d(this.radius, e.radius), this.show = d(this.show, e.show), this.showIntersection = d(this.showIntersection, e.showIntersection), this.intersectionColor = d(this.intersectionColor, e.intersectionColor), this.intersectionWidth = d(this.intersectionWidth, e.intersectionWidth), this.lateralSurfaceMaterial = d(this.lateralSurfaceMaterial, e.lateralSurfaceMaterial);
};
const ke = W.WHITE, De = 1, Fe = Number.POSITIVE_INFINITY, ze = new F(), Re = new p(), Ne = new M(), T = function(e, n) {
  if (!l(e))
    throw new C("scene is required.");
  if (!l(n))
    throw new C("entityCollection is required.");
  n.collectionChanged.addEventListener(T.prototype._onCollectionChanged, this), this._scene = e, this._primitives = e.primitives, this._entityCollection = n, this._hash = {}, this._entitiesToVisualize = new j(), this._onCollectionChanged(n, n.values, [], []);
};
T.prototype.update = function(e) {
  if (!l(e))
    throw new C("time is required.");
  for (var n = this._entitiesToVisualize.values, a = this._hash, s = this._primitives, t = 0, i = n.length; t < i; t++) {
    var o = n[t], r = o._customPatternSensor, u, f, h, _ = a[o.id], c = o.isShowing && o.isAvailable(e) && g.getValueOrDefault(r._show, e, !0);
    if (c && (u = g.getValueOrUndefined(o._position, e, Re), f = g.getValueOrUndefined(o._orientation, e, Ne), h = g.getValueOrUndefined(r._directions, e), c = l(u) && l(f) && l(h)), !c) {
      l(_) && (_.primitive.show = !1);
      continue;
    }
    var m = l(_) ? _.primitive : void 0;
    l(m) || (m = new x(), m.id = o, s.add(m), _ = {
      primitive: m,
      position: void 0,
      orientation: void 0
    }, a[o.id] = _), (!p.equals(u, _.position) || !M.equals(f, _.orientation)) && (b.fromRotationTranslation(F.fromQuaternion(f, ze), u, m.modelMatrix), _.position = p.clone(u, _.position), _.orientation = M.clone(f, _.orientation)), m.show = !0, m.directions = h, m.radius = g.getValueOrDefault(r._radius, e, Fe), m.lateralSurfaceMaterial = G.getValue(e, r._lateralSurfaceMaterial, m.lateralSurfaceMaterial), m.intersectionColor = g.getValueOrClonedDefault(r._intersectionColor, e, ke, m.intersectionColor), m.intersectionWidth = g.getValueOrDefault(r._intersectionWidth, e, De);
  }
  return !0;
};
T.prototype.isDestroyed = function() {
  return !1;
};
T.prototype.destroy = function() {
  for (var e = this._entitiesToVisualize.values, n = this._hash, a = this._primitives, s = e.length - 1; s > -1; s--)
    I(e[s], n, a);
  return L(this);
};
T.prototype._onCollectionChanged = function(e, n, a, s) {
  var t, i, o = this._entitiesToVisualize, r = this._hash, u = this._primitives;
  for (t = n.length - 1; t > -1; t--)
    i = n[t], l(i._customPatternSensor) && l(i._position) && l(i._orientation) && o.set(i.id, i);
  for (t = s.length - 1; t > -1; t--)
    i = s[t], l(i._customPatternSensor) && l(i._position) && l(i._orientation) ? o.set(i.id, i) : (I(i, r, u), o.remove(i.id));
  for (t = a.length - 1; t > -1; t--)
    i = a[t], I(i, r, u), o.remove(i.id);
};
const k = function() {
  this._xHalfAngle = void 0, this._xHalfAngleSubscription = void 0, this._yHalfAngle = void 0, this._yHalfAngleSubscription = void 0, this._lateralSurfaceMaterial = void 0, this._lateralSurfaceMaterialSubscription = void 0, this._intersectionColor = void 0, this._intersectionColorSubscription = void 0, this._intersectionWidth = void 0, this._intersectionWidthSubscription = void 0, this._showIntersection = void 0, this._showIntersectionSubscription = void 0, this._radius = void 0, this._radiusSubscription = void 0, this._show = void 0, this._showSubscription = void 0, this._definitionChanged = new Z();
};
Object.defineProperties(k.prototype, {
  /**
   * Gets the event that is raised whenever a new property is assigned.
   * @memberof RectangularSensorGraphics.prototype
   *
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    }
  },
  /**
   * A {@link Property} which returns an array of {@link Spherical} instances representing the pyramid's projection.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property}
   */
  xHalfAngle: v("xHalfAngle"),
  /**
   * A {@link Property} which returns an array of {@link Spherical} instances representing the pyramid's projection.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property}
   */
  yHalfAngle: v("yHalfAngle"),
  /**
   * Gets or sets the {@link MaterialProperty} specifying the the pyramid's appearance.
   * @memberof RectangularSensorGraphics.prototype
   * @type {MaterialProperty}
   */
  lateralSurfaceMaterial: v("lateralSurfaceMaterial"),
  /**
   * Gets or sets the {@link Color} {@link Property} specifying the color of the line formed by the intersection of the pyramid and other central bodies.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property}
   */
  intersectionColor: v("intersectionColor"),
  /**
   * Gets or sets the numeric {@link Property} specifying the width of the line formed by the intersection of the pyramid and other central bodies.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property}
   */
  intersectionWidth: v("intersectionWidth"),
  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the line formed by the intersection of the pyramid and other central bodies.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property}
   */
  showIntersection: v("showIntersection"),
  /**
   * Gets or sets the numeric {@link Property} specifying the radius of the pyramid's projection.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property}
   */
  radius: v("radius"),
  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the pyramid.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property}
   */
  show: v("show")
});
k.prototype.clone = function(e) {
  return l(e) || (e = new k()), e.xHalfAngle = this.xHalfAngle, e.yHalfAngle = this.yHalfAngle, e.radius = this.radius, e.show = this.show, e.showIntersection = this.showIntersection, e.intersectionColor = this.intersectionColor, e.intersectionWidth = this.intersectionWidth, e.lateralSurfaceMaterial = this.lateralSurfaceMaterial, e;
};
k.prototype.merge = function(e) {
  if (!l(e))
    throw new C("source is required.");
  this.xHalfAngle = d(this.xHalfAngle, e.xHalfAngle), this.yHalfAngle = d(this.yHalfAngle, e.yHalfAngle), this.radius = d(this.radius, e.radius), this.show = d(this.show, e.show), this.showIntersection = d(this.showIntersection, e.showIntersection), this.intersectionColor = d(this.intersectionColor, e.intersectionColor), this.intersectionWidth = d(this.intersectionWidth, e.intersectionWidth), this.lateralSurfaceMaterial = d(this.lateralSurfaceMaterial, e.lateralSurfaceMaterial);
};
function Y(e, n, a, s) {
  var t = n[e];
  l(t) || (t = new y(), n[e] = t), t.clock = a, t.cone = s, t.magnitude = 1;
}
function X(e) {
  var n = e._customSensor.directions, a = Math.tan(Math.min(e._xHalfAngle, w.toRadians(89))), s = Math.tan(Math.min(e._yHalfAngle, w.toRadians(89))), t = Math.atan(a / s), i = Math.atan(Math.sqrt(a * a + s * s));
  Y(0, n, t, i), Y(1, n, w.toRadians(180) - t, i), Y(2, n, w.toRadians(180) + t, i), Y(3, n, -t, i), n.length = 4, e._customSensor.directions = n;
}
const z = function(e) {
  e = d(e, d.EMPTY_OBJECT);
  var n = Ae(e);
  n._pickPrimitive = d(e._pickPrimitive, this), n.directions = void 0, this._customSensor = new x(n), this._xHalfAngle = d(e.xHalfAngle, w.PI_OVER_TWO), this._yHalfAngle = d(e.yHalfAngle, w.PI_OVER_TWO), X(this);
};
Object.defineProperties(z.prototype, {
  xHalfAngle: {
    get: function() {
      return this._xHalfAngle;
    },
    set: function(e) {
      if (e > w.PI_OVER_TWO)
        throw new C("xHalfAngle must be less than or equal to 90 degrees.");
      this._xHalfAngle !== e && (this._xHalfAngle = e, X(this));
    }
  },
  yHalfAngle: {
    get: function() {
      return this._yHalfAngle;
    },
    set: function(e) {
      if (e > w.PI_OVER_TWO)
        throw new C("yHalfAngle must be less than or equal to 90 degrees.");
      this._yHalfAngle !== e && (this._yHalfAngle = e, X(this));
    }
  },
  show: {
    get: function() {
      return this._customSensor.show;
    },
    set: function(e) {
      this._customSensor.show = e;
    }
  },
  showIntersection: {
    get: function() {
      return this._customSensor.showIntersection;
    },
    set: function(e) {
      this._customSensor.showIntersection = e;
    }
  },
  showThroughEllipsoid: {
    get: function() {
      return this._customSensor.showThroughEllipsoid;
    },
    set: function(e) {
      this._customSensor.showThroughEllipsoid = e;
    }
  },
  modelMatrix: {
    get: function() {
      return this._customSensor.modelMatrix;
    },
    set: function(e) {
      this._customSensor.modelMatrix = e;
    }
  },
  radius: {
    get: function() {
      return this._customSensor.radius;
    },
    set: function(e) {
      this._customSensor.radius = e;
    }
  },
  lateralSurfaceMaterial: {
    get: function() {
      return this._customSensor.lateralSurfaceMaterial;
    },
    set: function(e) {
      this._customSensor.lateralSurfaceMaterial = e;
    }
  },
  intersectionColor: {
    get: function() {
      return this._customSensor.intersectionColor;
    },
    set: function(e) {
      this._customSensor.intersectionColor = e;
    }
  },
  intersectionWidth: {
    get: function() {
      return this._customSensor.intersectionWidth;
    },
    set: function(e) {
      this._customSensor.intersectionWidth = e;
    }
  },
  id: {
    get: function() {
      return this._customSensor.id;
    },
    set: function(e) {
      this._customSensor.id = e;
    }
  }
});
z.prototype.update = function(e) {
  this._customSensor.update(e);
};
z.prototype.isDestroyed = function() {
  return !1;
};
z.prototype.destroy = function() {
  return this._customSensor = this._customSensor && this._customSensor.destroy(), L(this);
};
const qe = W.WHITE, Be = 1, Le = Number.POSITIVE_INFINITY, $e = new F(), Ye = new p(), Qe = new M(), P = function(e, n) {
  if (!l(e))
    throw new C("scene is required.");
  if (!l(n))
    throw new C("entityCollection is required.");
  n.collectionChanged.addEventListener(P.prototype._onCollectionChanged, this), this._scene = e, this._primitives = e.primitives, this._entityCollection = n, this._hash = {}, this._entitiesToVisualize = new j(), this._onCollectionChanged(n, n.values, [], []);
};
P.prototype.update = function(e) {
  if (!l(e))
    throw new C("time is required.");
  for (var n = this._entitiesToVisualize.values, a = this._hash, s = this._primitives, t = 0, i = n.length; t < i; t++) {
    var o = n[t], r = o._rectangularSensor, u, f, h = a[o.id], _ = o.isShowing && o.isAvailable(e) && g.getValueOrDefault(r._show, e, !0);
    if (_ && (u = g.getValueOrUndefined(o._position, e, Ye), f = g.getValueOrUndefined(o._orientation, e, Qe), _ = l(u) && l(f)), !_) {
      l(h) && (h.primitive.show = !1);
      continue;
    }
    var c = l(h) ? h.primitive : void 0;
    l(c) || (c = new z(), c.id = o, s.add(c), h = {
      primitive: c,
      position: void 0,
      orientation: void 0
    }, a[o.id] = h), (!p.equals(u, h.position) || !M.equals(f, h.orientation)) && (b.fromRotationTranslation(F.fromQuaternion(f, $e), u, c.modelMatrix), h.position = p.clone(u, h.position), h.orientation = M.clone(f, h.orientation)), c.show = !0, c.xHalfAngle = g.getValueOrDefault(r._xHalfAngle, e, w.PI_OVER_TWO), c.yHalfAngle = g.getValueOrDefault(r._yHalfAngle, e, w.PI_OVER_TWO), c.radius = g.getValueOrDefault(r._radius, e, Le), c.lateralSurfaceMaterial = G.getValue(e, r._lateralSurfaceMaterial, c.lateralSurfaceMaterial), c.intersectionColor = g.getValueOrClonedDefault(r._intersectionColor, e, qe, c.intersectionColor), c.intersectionWidth = g.getValueOrDefault(r._intersectionWidth, e, Be);
  }
  return !0;
};
P.prototype.isDestroyed = function() {
  return !1;
};
P.prototype.destroy = function() {
  for (var e = this._entitiesToVisualize.values, n = this._hash, a = this._primitives, s = e.length - 1; s > -1; s--)
    I(e[s], n, a);
  return L(this);
};
P.prototype._onCollectionChanged = function(e, n, a, s) {
  var t, i, o = this._entitiesToVisualize, r = this._hash, u = this._primitives;
  for (t = n.length - 1; t > -1; t--)
    i = n[t], l(i._rectangularSensor) && l(i._position) && l(i._orientation) && o.set(i.id, i);
  for (t = s.length - 1; t > -1; t--)
    i = s[t], l(i._rectangularSensor) && l(i._position) && l(i._orientation) ? o.set(i.id, i) : (I(i, r, u), o.remove(i.id));
  for (t = a.length - 1; t > -1; t--)
    i = a[t], I(i, r, u), o.remove(i.id);
};
var S = ee.processPacketData, Je = ee.processMaterialPacketData;
function fe(e, n, a, s, t) {
  var i, o, r = [], u = n.unitSpherical, f = n.spherical, h = n.unitCartesian, _ = n.cartesian;
  if (l(u)) {
    for (i = 0, o = u.length; i < o; i += 2)
      r.push(new y(u[i], u[i + 1]));
    n.array = r;
  } else if (l(f)) {
    for (i = 0, o = f.length; i < o; i += 3)
      r.push(new y(f[i], f[i + 1], f[i + 2]));
    n.array = r;
  } else if (l(h)) {
    for (i = 0, o = h.length; i < o; i += 3) {
      var c = y.fromCartesian3(new p(h[i], h[i + 1], h[i + 2]));
      y.normalize(c, c), r.push(c);
    }
    n.array = r;
  } else if (l(_)) {
    for (i = 0, o = _.length; i < o; i += 3)
      r.push(y.fromCartesian3(new p(_[i], _[i + 1], _[i + 2])));
    n.array = r;
  }
  S(Array, e, "directions", n, a, s, t);
}
function ie(e, n, a, s, t) {
  S(Boolean, e, "show", n.show, a, s, t), S(Number, e, "radius", n.radius, a, s, t), S(Boolean, e, "showIntersection", n.showIntersection, a, s, t), S(W, e, "intersectionColor", n.intersectionColor, a, s, t), S(Number, e, "intersectionWidth", n.intersectionWidth, a, s, t), Je(e, "lateralSurfaceMaterial", n.lateralSurfaceMaterial, a, s, t);
}
var D = {
  iso8601: void 0
};
function Ke(e, n, a, s) {
  var t = n.agi_conicSensor;
  if (l(t)) {
    var i, o = t.interval;
    l(o) && (D.iso8601 = o, i = te.fromIso8601(D));
    var r = e.conicSensor;
    l(r) || (e.addProperty("conicSensor"), r = new O(), e.conicSensor = r), ie(r, t, i, s, a), S(Number, r, "innerHalfAngle", t.innerHalfAngle, i, s, a), S(Number, r, "outerHalfAngle", t.outerHalfAngle, i, s, a), S(Number, r, "minimumClockAngle", t.minimumClockAngle, i, s, a), S(Number, r, "maximumClockAngle", t.maximumClockAngle, i, s, a);
  }
}
function Ue(e, n, a, s) {
  var t = n.agi_customPatternSensor;
  if (l(t)) {
    var i, o = t.interval;
    l(o) && (D.iso8601 = o, i = te.fromIso8601(D));
    var r = e.customPatternSensor;
    l(r) || (e.addProperty("customPatternSensor"), r = new H(), e.customPatternSensor = r), ie(r, t, i, s, a);
    var u = t.directions;
    if (l(u))
      if (Array.isArray(u))
        for (var f = u.length, h = 0; h < f; h++)
          fe(r, u[h], i, s, a);
      else
        fe(r, u, i, s, a);
  }
}
function Xe(e, n, a, s) {
  var t = n.agi_rectangularSensor;
  if (l(t)) {
    var i, o = t.interval;
    l(o) && (D.iso8601 = o, i = te.fromIso8601(D));
    var r = e.rectangularSensor;
    l(r) || (e.addProperty("rectangularSensor"), r = new k(), e.rectangularSensor = r), ie(r, t, i, s, a), S(Number, r, "xHalfAngle", t.xHalfAngle, i, s, a), S(Number, r, "yHalfAngle", t.yHalfAngle, i, s, a);
  }
}
var _e = !1;
function Ze() {
  if (!_e) {
    ee.updaters.push(Ke, Ue, Xe);
    var e = le.defaultVisualizersCallback;
    le.defaultVisualizersCallback = function(n, a, s) {
      var t = s.entities, i = e(n, a, s);
      return i.concat([
        new E(n, t),
        new T(n, t),
        new P(n, t)
      ]);
    }, _e = !0;
  }
}
Ze();
const Ge = {
  ConicSensorGraphics: O,
  ConicSensorVisualizer: E,
  CustomPatternSensorGraphics: H,
  CustomPatternSensorVisualizer: T,
  CustomSensorVolume: x,
  RectangularPyramidSensorVolume: z,
  RectangularSensorGraphics: k,
  RectangularSensorVisualizer: P
};
export {
  Ge as default
};
