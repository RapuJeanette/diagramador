import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import * as go from 'gojs';
import { SocketService } from 'src/app/services/socket.service';
const $ = go.GraphObject.make;

@Component({
  selector: 'app-diagram-editor',
  templateUrl: './diagram-editor.component.html',
  styleUrls: ['./diagram-editor.component.css']
})
export class DiagramEditorComponent implements OnInit, AfterViewInit {
  public diagram: go.Diagram = new go.Diagram();
  public palette: go.Palette = new go.Palette();

  @Input()
  public model: go.Model | undefined;

  constructor(private socketService: SocketService) {

  }

  @HostListener('document:click', ['$event'])

  onClick(e: any) {
    if (this.diagram.isModified) {
      this.emitData();
    } else {
      this.diagram.isModified = false;
    }
  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.initializeDiagram();
  }

  emitData() {
    const coorDiagram = JSON.stringify(this.diagram.model.toJson());
    console.log(coorDiagram);
  }


  initializeDiagram() {
    this.diagram = $(go.Diagram, "diagramDiv",  // must name or refer to the DIV HTML element
      {
        grid: $(go.Panel, "Grid",
          $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
          $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
          $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
          $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
        ),
        "draggingTool.dragsLink": true,
        "draggingTool.isGridSnapEnabled": true,
        "linkingTool.isUnconnectedLinkValid": true,
        "linkingTool.portGravity": 20,
        "relinkingTool.isUnconnectedLinkValid": true,
        "relinkingTool.portGravity": 20,
        "relinkingTool.fromHandleArchetype":
          $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
        "relinkingTool.toHandleArchetype":
          $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
        "linkReshapingTool.handleArchetype":
          $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
        "rotatingTool.handleAngle": 270,
        "rotatingTool.handleDistance": 30,
        "rotatingTool.snapAngleMultiple": 15,
        "rotatingTool.snapAngleEpsilon": 15,
        "undoManager.isEnabled": true
      });

    function makePort(name: any, spot: any, output: any, input: any) {
      // the port is basically just a small transparent circle
      return $(go.Shape, "Circle",
        {
          fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
          stroke: null,
          desiredSize: new go.Size(7, 7),
          alignment: spot,  // align the port on the main Shape
          alignmentFocus: spot,  // just inside the Shape
          portId: name,  // declare this object to be a "port"
          fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
          fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
          cursor: "pointer"  // show a different cursor to indicate potential link point
        });
    }

    var nodeSelectionAdornmentTemplate =
      $(go.Adornment, "Auto",
        $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
        $(go.Placeholder)
      );

    var nodeResizeAdornmentTemplate =
      $(go.Adornment, "Spot",
        { locationSpot: go.Spot.Right },
        $(go.Placeholder),
        $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

        $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

        $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
      );

    var nodeRotateAdornmentTemplate =
      $(go.Adornment,
        { locationSpot: go.Spot.Center, locationObjectName: "ELLIPSE" },
        $(go.Shape, "Ellipse", { name: "ELLIPSE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
      );
    this.diagram.nodeTemplate =
      $(go.Node, "Spot",
        { locationSpot: go.Spot.Center },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
        { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
        { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
        new go.Binding("angle").makeTwoWay(),
        // the main object is a Panel that surrounds a TextBlock with a Shape
        $(go.Panel, "Auto",
          { name: "PANEL" },
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          $(go.Shape, "Rectangle",  // default figure
            {
              portId: "", // the default port: if no spot on link data, use closest side
              fromLinkable: true, toLinkable: true, cursor: "pointer",
              fill: "black",  // default color
              strokeWidth: 2
            },
            new go.Binding("figure"),
            new go.Binding("fill")),
          $(go.TextBlock,
            {
              font: "bold 11pt Helvetica, Arial, sans-serif",
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        ),
        // four small named ports, one on each side:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false),
        { // handle mouse enter/leave events to show/hide the ports
          mouseEnter: (e, node) => showSmallPorts(node, true),
          mouseLeave: (e, node) => showSmallPorts(node, false)
        }
      );
    function showSmallPorts(node: any, show: any) {
      node.ports.each((port: any) => {
        if (port.portId !== "") {  // don't change the default port, which is the big shape
          port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
      });
    }
    var linkSelectionAdornmentTemplate =
      $(go.Adornment, "Link",
        $(go.Shape,
          // isPanelMain declares that this Shape shares the Link.geometry
          { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
      );

    this.diagram.linkTemplate =
      $(go.Link,  // the whole link panel
        { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
        { relinkableFrom: true, relinkableTo: true, reshapable: true },
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4
        },
        new go.Binding("points").makeTwoWay(),
        $(go.Shape,  // the link path shape
          { isPanelMain: true, strokeWidth: 2 }),
        $(go.Shape,  // the arrowhead
          { toArrow: "Standard", stroke: null }),
        $(go.Panel, "Auto",
          new go.Binding("visible", "isSelected").ofObject(),
          $(go.Shape, "RoundedRectangle",  // the link shape
            { fill: "#F8F8F8", stroke: null }),
          $(go.TextBlock,
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#919191",
              margin: 2,
              minSize: new go.Size(10, NaN),
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        )
      );

    go.Shape.defineFigureGenerator("Control", function (shape, w, h) {
      var geo = new go.Geometry();
      var fig = new go.PathFigure(w / 2, -0, true); // Comienza en la parte superior del círculo
      geo.add(fig);

      fig.add(new go.PathSegment(go.PathSegment.Arc, 40, 0, w / 4, h / 3, w - 20, h / 32));
      fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 500, w / 2, h / 2, w / 2 - 6, h / 2));
      fig.add(new go.PathSegment(go.PathSegment.Arc, 30, 10, w / 3, h / 90, w - 25, h / 360));

      return geo;
    })

    go.Shape.defineFigureGenerator("Entity", function (shape, w, h) {
      var geo = new go.Geometry();
      var fig = new go.PathFigure(0, h / 2, true); // Comienza en la parte superior

      // Línea vertical
      fig.add(new go.PathSegment(go.PathSegment.Line, w + 2, h / 2));

      // Línea horizontal
      fig.add(new go.PathSegment(go.PathSegment.Line, w / 360, h / 2));

      // Círculo
      fig.add(new go.PathSegment(go.PathSegment.Arc, 120, 360, w / 2, h / 4, w / 4, w / 4));

      geo.add(fig);

      return geo;
    }
    );

    go.Shape.defineFigureGenerator("Conector", function (shape, w, h) {
      var geo = new go.Geometry();
      var fig = new go.PathFigure(0, 0.15 * h, true);
      geo.add(fig);

      // Package bottom rectangle
      fig.add(new go.PathSegment(go.PathSegment.Line, w / 2, 0.15 * h));
      fig.add(new go.PathSegment(go.PathSegment.Line, w / 2, h));
      fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
      // Package top flap
      geo.spot1 = new go.Spot(0, 0.1);
      geo.spot2 = new go.Spot(1, 1);
      return geo;
    });

    go.Shape.defineFigureGenerator("Rectangle", function (shape, w, h) {
      var geo = new go.Geometry();
      var fig = new go.PathFigure(0, 0.15 * h, true);
      geo.add(fig);

      // Package bottom rectangle
      fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.15 * h));
      fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
      fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
      // Package top flap
      geo.spot1 = new go.Spot(0, 0.1);
      geo.spot2 = new go.Spot(1, 1);
      return geo;
    });

    go.Shape.defineFigureGenerator("BpmnTaskUser", function (shape, w, h) {
      var geo = new go.Geometry();
      var fig = new go.PathFigure(0, 0, false);
      geo.add(fig);

      var fig2 = new go.PathFigure(.335 * w, (1 - .555) * h, true);
      geo.add(fig2);
      // Shirt
      fig2.add(new go.PathSegment(go.PathSegment.Line, .335 * w, (1 - .405) * h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - .335) * w, (1 - .405) * h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - .335) * w, (1 - .555) * h));
      fig2.add(new go.PathSegment(go.PathSegment.Bezier, w, .68 * h, (1 - .12) * w, .46 * h,
        (1 - .02) * w, .54 * h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, w, h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, 0, h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, 0, .68 * h));
      fig2.add(new go.PathSegment(go.PathSegment.Bezier, .335 * w, (1 - .555) * h, .02 * w, .54 * h,
        .12 * w, .46 * h));
      // Start of neck
      fig2.add(new go.PathSegment(go.PathSegment.Line, .365 * w, (1 - .595) * h));
      var radiushead = .5 - .285;
      var centerx = .5;
      var centery = radiushead;
      var alpha2 = Math.PI / 4;
      var KAPPA = ((4 * (1 - Math.cos(alpha2))) / (3 * Math.sin(alpha2)));
      var cpOffset = KAPPA * .5;
      var radiusw = radiushead;
      var radiush = radiushead;
      var offsetw = KAPPA * radiusw;
      var offseth = KAPPA * radiush;
      // Circle (head)
      fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radiusw) * w, centery * h, (centerx - ((offsetw + radiusw) / 2)) * w, (centery + ((radiush + offseth) / 2)) * h,
        (centerx - radiusw) * w, (centery + offseth) * h));
      fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radiush) * h, (centerx - radiusw) * w, (centery - offseth) * h,
        (centerx - offsetw) * w, (centery - radiush) * h));
      fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radiusw) * w, centery * h, (centerx + offsetw) * w, (centery - radiush) * h,
        (centerx + radiusw) * w, (centery - offseth) * h));
      fig2.add(new go.PathSegment(go.PathSegment.Bezier, (1 - .365) * w, (1 - .595) * h, (centerx + radiusw) * w, (centery + offseth) * h,
        (centerx + ((offsetw + radiusw) / 2)) * w, (centery + ((radiush + offseth) / 2)) * h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - .365) * w, (1 - .595) * h));
      // Neckline
      fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - .335) * w, (1 - .555) * h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - .335) * w, (1 - .405) * h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, .335 * w, (1 - .405) * h));
      var fig3 = new go.PathFigure(.2 * w, h, false);
      geo.add(fig3);
      // Arm lines
      fig3.add(new go.PathSegment(go.PathSegment.Line, .2 * w, .8 * h));
      var fig4 = new go.PathFigure(.8 * w, h, false);
      geo.add(fig4);
      fig4.add(new go.PathSegment(go.PathSegment.Line, .8 * w, .8 * h));
      return geo;
    });
    
    go.Shape.defineFigureGenerator("Package", function (shape, w, h) {
      var geo = new go.Geometry();
      var fig = new go.PathFigure(0, 0.15 * h, true);
      geo.add(fig);

      // Package bottom rectangle
      fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.15 * h));
      fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
      fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
      var fig2 = new go.PathFigure(0, 0.15 * h, true);
      geo.add(fig2);
      // Package top flap
      fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0));
      fig2.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0));
      fig2.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0.15 * h).close());
      geo.spot1 = new go.Spot(0, 0.1);
      geo.spot2 = new go.Spot(1, 1);
      return geo;
    });

    go.Shape.defineFigureGenerator("CustomShape",
      function (shape, w, h) {
        var geo = new go.Geometry();
        var fig = new go.PathFigure(0, h / 30, true); // Comienza en la parte superior
        var fig2 = new go.PathFigure(0, h / 2, true);
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h / 1));
        geo.add(fig)
        fig2.add(new go.PathSegment(go.PathSegment.Line, w / 4, h / 2));
        fig2.add(new go.PathSegment(go.PathSegment.Arc, 160, 360, w / 2, h / 2, w / 4, w / 4));
        geo.add(fig2);
        return geo;
      }
    );

    go.Shape.defineFigureGenerator("Final",
      function (shape, w, h) {
        var geo = new go.Geometry();
        var fig = new go.PathFigure(w / 2, h / 2, true);
        fig.add(new go.PathSegment(go.PathSegment.Arc, 0, 360, w / 2, h / 2, w / 4, w / 4));
        geo.add(fig);
        return geo;
      }
    );


    this.palette =
      $(go.Palette, "paletteDiv",  // must name or refer to the DIV HTML element
        {
          maxSelectionCount: 1,
          nodeTemplateMap: this.diagram.nodeTemplateMap,  // share the templates used by myDiagram
          linkTemplate: // simplify the link template, just in this Palette
            $(go.Link,
              {
                locationSpot: go.Spot.Center,
                selectionAdornmentTemplate:
                  $(go.Adornment, "Link",
                    { locationSpot: go.Spot.Center },
                    $(go.Shape,
                      { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }),
                    $(go.Shape,  // the arrowhead
                      { toArrow: "Standard", stroke: null })
                  )
              },
              {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 5,
                toShortLength: 4
              },
              new go.Binding("points"),
              $(go.Shape,  // the link path shape
                { isPanelMain: true, strokeWidth: 2 }),
              $(go.Shape,  // the arrowhead
                { toArrow: "Standard", stroke: null }),
            ),

          model: new go.GraphLinksModel([  // specify the contents of the Palette
            { text: "Actor", figure: "BpmnTaskUser", "size": "80 70", fill: "greenyellow" },
            { text: "Paquetes", figure: "Package", "size": "90 80", fill: "lightyellow" },
            { text: "", figure: "Final", size: "80 70", fill: "black" },
            { text: "", figure: "Control", size: "70 60", fill: "#FF5733" },
            { text: "Objeto", figure: "Rectangule", size: "90 80", fill: "aliceblue" },
            { text: "", figure: "CustomShape", size: "90 80", fill: "lightyellow" },
            { text: "", figure: "Conector", size: "90 80", fill: "white" },

            { text: "", figure: "Entity", size: "90 80", fill: "#33FF57" },
          ], [
            // the Palette also has a disconnected Link, which the user can drag-and-drop
            { points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
          ])
        });
  }

  load(diagramData: any) {
    this.diagram.model = go.Model.fromJson(JSON.parse(diagramData));
    console.log(this.diagram.model)
    this.diagram.animationManager.initialAnimationStyle = go.AnimationManager.None;
    this.loadDiagramProperties();
  }

  saveDiagramProperties() {
    this.diagram.model.modelData['position'] = go.Point.stringify(this.diagram.position);
  }

  loadDiagramProperties() {
    var pos = this.diagram.model.modelData['position'];

    if (pos) {
      console.log(pos)
      this.diagram.initialPosition = go.Point.parse(pos);
    }
  }
}

