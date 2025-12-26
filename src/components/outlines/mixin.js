import g_config from "./config"
import G6 from "@antv/g6";
import tool from "../../tool/tool";
import { Modal } from "view-design";

export default {
  data() {
    return {
      data: {
        nodes: [
          // 默认根节点
          {
            id: "root",
            type: "flow_rect",
            node_type: "root",
            label: "新建病例",
            degree: 2,
            stroke: "#4098FF",
            fill: "#4098FF",
            color: "#fff",
            hide_add_arrow: true,
            is_selected: false,
            is_hover: false,
            x: 700,
            y: 100,
            comboId: ""
          },
        ],
        // 边
        edges: [],
      },
      // 当前图
      graph: {},
      is_edit: false, // 编辑模块显示隐藏
      current_edit_child_index: 0, // 当前编辑的子节点索引
      last_node_id: 'root',
      model: {}, // 当前编辑的节点
      is_select_node_to_combo: false,// 是否正在选择节点到combo
      step_stack: [],// 存储记录栈
      // 节点种类
      node_type_list: [
        {
          node_type: "normal",
          type: "flow_rect",
          img: require("../../assets/img/normal_node.png"),
          label: "节点"
        },
        {
          node_type: "gather",
          type: "flow_gather_rect",
          img: require("../../assets/img/gather.png"),
          label: "集合"
        },
        {
          node_type: "diamond",
          type: "flow_option_diamond",
          img: require("../../assets/img/diamond.png"),
          label: "判断"
        }
      ],
      // 标记模块
      mark_name_list: ['集合', '问诊要素', '查体要素', '辅检要素', '鉴别要素', '病种要素', '治疗要素'],
      mark_list: [
        {
          id: 1,
          color: '#80B9FC',
          bg: 'rgba(128,185,252,0.1)',
          label: "问诊要素",
          short_label: "问诊",
          type: 'talk'
        },
        {
          id: 2,
          color: '#60CFD7',
          bg: 'rgba(96,207,215,0.1)',
          label: "查体要素",
          short_label: "体检",
          type: 'physical'
        },
        {
          id: 3,
          color: '#FF7FDA',
          bg: 'rgba(255,127,218,0.1)',
          label: "辅检要素",
          short_label: "辅检",
          type: 'assist'
        },
        {
          id: 4,
          color: '#FFAE27',
          bg: 'rgba(255,174,39,0.1)',
          label: "鉴别要素",
          short_label: "鉴别",
          type: 'identify_element'
        },
        {
          id: 5,
          color: '#F47676',
          bg: "rgba(244,118,118,0.1)",
          label: "病种要素",
          short_label: "病种"
        },
        {
          id: 6,
          color: '#9CE260',
          bg: "rgba(156,226,96,0.1)",
          label: "治疗要素",
          short_label: "治疗",
          type: 'treat'
        }
      ],
      // tags Map
      tag_map: {
        "talk": {
          tag: '依',
          label: "问诊依据",
          short_label: "问诊",
          bg: "#2282DB",
          title_tag_bg: "#2282DB"
        },
        "physical": {
          tag: '依',
          label: "查体依据",
          short_label: "查体",
          bg: "#2282DB",
          title_tag_bg: "#60CFD7"
        },
        "assist": {
          tag: '依',
          label: "辅检依据",
          short_label: "辅检",
          bg: "#2282DB",
          title_tag_bg: "#FF7FDA"
        },
        "treat": {
          tag: '处',
          label: "处置治疗",
          short_label: "治疗",
          bg: "#9CE260",
          title_tag_bg: "#9CE260"
        },
        "identify_element": {
          tag: '联',
          label: "关联依据",
          short_label: "关联",
          bg: "#2FC2BA",
          title_tag_bg: "#2FC2BA"
        },
        "key_points": {
          tag: '?',
          label: "要点说明",
          short_label: "要点",
          bg: "#F06363",
          title_tag_bg: "#F06363"
        }
      },
      current_tag_info: {
        type: "talk",
        length: 0,
        data: []
      },
      // 病种种类 （主次鉴）
      illness_type_list: ["PrincipalDiagnosis", "SecondaryDiagnosis", "DifferentialDiagnosis"],
      // 折叠面板,存储已经被折叠的key
      collapse_arr: [],
      // 步骤相关
      /**
       * [
       *  {
       *    type:"node",
       *    model:{}
       *  },
       *  {
       *    type:"edge",
       *    model:{}
       *  }
       * ]
       */
      redoList: [], // 恢复 (删除放这里)
      undoList: [] // 撤销 (添加放这里)
    }
  },
  mounted() {
    let self = this
    self.combos_nodes = []
    self.graphSize = document.getElementById("container").getBoundingClientRect();
    console.log(self.graphSize)
    // 注册
    // 注册普通矩形节点
    G6.registerNode("flow_rect", {
      options: {
        style: {},
        stateStyles: {
          hover: {},
          selected: {}
        }
      },
      /**
       * 绘制节点，包含文本
       * @param  {Object} cfg 节点的配置项
       * @param  {G.Group} group 节点的容器
       * @return {G.Shape} 返回一个绘制的图形作为 keyShape，通过 node.get('keyShape') 可以获取。
       * 关于 keyShape 可参考文档 核心概念-节点/边/Combo-图形 Shape 与 keyShape
       */
      draw(cfg, group) {
        let size = cfg.size;
        let width = 0;
        let height = g_config.rect_node.height_default;
        // 通过 label 计算 矩形宽高
        let width_calc = 0
        // 有几行字，默认一行
        let lines = 1
        // 当有label，
        if (cfg.label) {
          width_calc = cfg.label.length * g_config.normal_node.font_size_default
          width_calc = width_calc > 200 ? 200 : width_calc
          lines = cfg.label.split('\n').length
        }
        // 矩形宽
        width = Math.max(width_calc, size[0])
        // 矩形高
        height = height + (lines - 1) * g_config.normal_node.line_height_default
        // 更新矩形大小
        cfg.size = [width, height]

        // 矩形相关
        const rect = group.addShape("rect", {
          zIndex: 1,
          attrs: {
            x: - width / 2,
            y: 0,
            // y: - height / 2,
            stroke: cfg.stroke || g_config.normal_node.stroke_color_default,//边框
            width: cfg.size[0],
            height: cfg.size[1],
            fill: cfg.fill || g_config.normal_node.fill_color_default,//填充颜色
            radius: g_config.normal_node.border_radius_default,
            lineWidth: g_config.normal_node.border_width_default
          },
          className: "singleRect"
        });


        /**
         * hide_add_arrow 是否显示添加线的锚点 
         * true 不显示
         * false 显示
         */
        if (!cfg.hide_add_arrow) {
          self.drawLinkPoints(cfg, group)
        }

        // label相关
        if (cfg.label) {
          group.addShape("text", {
            zIndex: 1,
            attrs: {
              text: cfg.label,
              x: 0,
              // y: 0,
              y: height / 2,
              fill:
                (cfg.label === g_config.normal_node.placeholder_default ||
                  cfg.label === g_config.ill_node.placeholder_default)
                  ? g_config.normal_node.color_placeholder_default
                  : cfg.color,//字体颜色
              fontSize: g_config.normal_node.font_size_default,
              textAlign: "center",
              textBaseline: "middle",
              lineHeight: g_config.normal_node.line_height_default
            },
            className: "singleRectText",
            name: "text-shape"
          });
        }
        // 要点标记
        if (cfg.node_type != "root") {
          // if (cfg.tags[0].files.length > 0 || cfg.tags[0].label) {
          self.drawParentKeyPointsTag(cfg, group)
          // }
        }
        return rect;
      },
      afterDraw(cfg, group) {
        if (cfg.is_selected) {
          // self.parentNodeAnimate(cfg, group)
        } else {
          if (cfg.is_hover) {
            // self.parentNodeAnimate(cfg, group, false)
          }
        }
      },
    });
    // 注册集合矩形节点
    G6.registerNode("flow_gather_rect", {
      options: {
        style: {
          width: g_config.gather_node.outer_rect_width_default,
          height: g_config.gather_node.outer_rect_height_default
        },
        stateStyles: {
          hover: {},
          selected: {}
        }
      },
      /**
       * 绘制节点，包含文本
       * @param  {Object} cfg 节点的配置项
       * @param  {G.Group} group 节点的容器
       * @return {G.Shape} 返回一个绘制的图形作为 keyShape，通过 node.get('keyShape') 可以获取。
       * 关于 keyShape 可参考文档 核心概念-节点/边/Combo-图形 Shape 与 keyShape
       */
      draw(cfg, group) {
        // let size = cfg.size;
        // let width = size[0];
        // let height = size[1];
        let width = 0, height = 0
        let gather = {};
        // let down_arrow_top; // 箭头 top
        // 集合节点状态
        const gather_rect_state = cfg.state || g_config.gather_node.state_default;
        // 展开状态
        if (gather_rect_state == 1) {
          // 计算展开之后的宽度和高度
          let children = cfg.children;
          let outer_rect_height;
          let max_char_length; // 文字+tag总数

          width =
            children.length * g_config.gather_node.child_width_default +
            (children.length + 1) * g_config.gather_node.child_spacing;



          max_char_length = Math.max(
            ...children.map(x => x.label.split("\n").length) // + x.tags.length
          );


          outer_rect_height = Math.floor(max_char_length) * g_config.normal_node.font_size_default + 2 * g_config.gather_node.child_padding_tb

          // down_arrow_top = 
          height = Math.max(outer_rect_height, g_config.gather_node.child_height_default);

          // 更新节点宽高
          cfg.size = [width, height + 2 * g_config.gather_node.child_padding_tb]

          gather = group.addShape("rect", {
            zIndex: 1,
            attrs: {
              x: -cfg.size[0] / 2,
              // y: -cfg.size[1] / 2,
              y: 0,
              stroke: cfg.stroke || g_config.normal_node.stroke_color_default,
              width: cfg.size[0],
              height: cfg.size[1], //+ gather_child_padding * 2,
              fill: cfg.fill || g_config.normal_node.fill_color_default,
              radius: g_config.normal_node.border_radius_default,
              lineWidth: g_config.normal_node.border_width_default
            },
            className: "gatherOuterRect"
          });
          // 子shape
          children.forEach((child, index) => {
            let height_calc = (Math.floor(child.label.split("\n").length))
              * g_config.normal_node.font_size_default + 2 * g_config.gather_node.child_padding_tb

            height = Math.max(height_calc, g_config.gather_node.child_height_default);

            group.addShape("rect", {
              zIndex: 2,
              attrs: {
                x:
                  g_config.gather_node.child_width_default * index +
                  g_config.gather_node.child_spacing * (index + 1) - cfg.size[0] / 2,
                // y: g_config.gather_node.child_padding_tb - cfg.size[1] / 2,
                y: g_config.gather_node.child_padding_tb ,
                stroke: child.stroke || g_config.normal_node.stroke_color_default,
                fill: child.fill || g_config.normal_node.fill_color_default,
                width: g_config.gather_node.child_width_default,
                height: height, //
                radius: g_config.normal_node.border_radius_default,
                lineWidth: g_config.normal_node.border_width_default,
                cursor: (child.tags.length > 1 || child.tags[0].label || child.tags[0].files.length > 0) ? 'pointer' : ''
              },
              element_type: child.element_type || null,
              element_or_illness_id: child.element_or_illness_id || null,
              childRectIndex: index,
              className: "gatherChildRect"
            });

            // 更新子节点宽高
            cfg.children[index].size = [g_config.gather_node.child_width_default, height]

            let y_calc;
            y_calc = height / 2 + g_config.gather_node.child_padding_tb;
            group.addShape("text", {
              zIndex: 3,
              attrs: {
                x:
                  g_config.gather_node.child_width_default * (index + 0.5) +
                  g_config.gather_node.child_spacing * (index + 1) - cfg.size[0] / 2,
                // y: y_calc - cfg.size[1] / 2,
                y: y_calc,
                // fill: g_config.normal_node.color_default,
                fill:child.color ? child.color : g_config.normal_node.color_default,
                fontSize: g_config.normal_node.font_size_default,
                textAlign: "center",
                textBaseline: "middle",
                fontFamily: "fonteditor",
                text: child.label,
                lineHeight: g_config.normal_node.line_height_default,
                cursor: (child.tags.length > 1 || child.tags[0].label || child.tags[0].files.length > 0) ? 'pointer' : ''
              },
              element_type: child.element_type || null,
              element_or_illness_id: child.element_or_illness_id || null,
              childRectIndex: index,
              className: "gatherChildRect"
            });
            // 
            self.drawChildShapeKeyPointsTag(cfg, group, index)
          });
        }
        // 收起状态
        if (gather_rect_state == 2) {
          // down_arrow_top = height
          width = g_config.gather_node.outer_rect_width_default
          // 更新节点宽高
          cfg.size = [width, g_config.gather_node.outer_rect_height_default]
          gather = group.addShape("rect", {
            zIndex: 1,
            attrs: {
              x: -cfg.size[0] / 2,
              // y: -cfg.size[1] / 2,
              y: 0,
              stroke: cfg.stroke || g_config.normal_node.stroke_color_default,
              width: cfg.size[0],
              height: cfg.size[1],
              fill: cfg.fill || g_config.normal_node.fill_color_default,
              radius: g_config.normal_node.border_radius_default,
              lineWidth: g_config.normal_node.border_width_default
            },
            className: "gatherOuterRect"
          });
          group.addShape("rect", {
            zIndex: 1,
            attrs: {
              x: -cfg.size[0] / 2 + 10,
              // y: -cfg.size[1] / 2 + 10,
              y: 10,
              stroke: g_config.normal_node.stroke_color_default,
              width: g_config.rect_node.width_default,
              height: g_config.rect_node.height_default,
              fill: g_config.normal_node.fill_color_default,
              radius: g_config.normal_node.border_radius_default,
              lineWidth: g_config.normal_node.border_width_default
            },
            className: "packUpInnerRect"
          });
          group.addShape("text", {
            zIndex: 2,
            attrs: {
              x: 0,
              y: cfg.size[1] / 2,
              // y:0,
              fill: g_config.normal_node.color_default,
              // fill: 'red',
              fontSize: g_config.normal_node.font_size_default,
              textAlign: "center",
              textBaseline: "middle",
              text: cfg.label,
              // text: `cfg.label`,
              lineHeight: g_config.normal_node.line_height_default
            }
          })


        }

        // 添加边锚点
        if (!cfg.hide_add_arrow) {
          self.drawLinkPoints(cfg, group)
        }
        // 画收起节点
        group.addShape("circle", {
          zIndex: 1,
          attrs: {
            x: 0,
            // y: -cfg.size[1] / 2,
            y: 0,
            r: g_config.normal_pack.pack_r,
            fill: g_config.normal_pack.pack_fill_default,
            stroke: g_config.normal_pack.pack_fill_default,
            cursor: "pointer"
          },
          className: "packUp"
        });
        // 画收起节点上文字
        group.addShape("text", {
          zIndex: 1,
          attrs: {
            x: 0,
            // y: -cfg.size[1] / 2,
            y: 0,
            stroke: g_config.normal_pack.pack_fill_default,
            fill: "#fff",
            fontSize: g_config.normal_node.font_size_default,
            textAlign: "center",
            textBaseline: "middle",
            text: gather_rect_state == 1 ? "-" : "+",
            lineHeight: g_config.normal_node.line_height_default,
            cursor: "pointer"
          },
          className: "packUp"
        });
        if (cfg.tags[0].label || cfg.tags[0].files.length > 0) {
          self.drawParentKeyPointsTag(cfg, group)
        }
        return gather;
      },
      afterDraw(cfg, group) {
        if (cfg.is_selected) {
          // self.parentNodeAnimate(cfg, group)
        } else {
          if (cfg.is_hover) {
            // self.parentNodeAnimate(cfg, group, false)
          }
        }
        // childShape 动画
        for (let i = 0; i < cfg.children.length; i++) {
          if (cfg.children[i].is_selected) {
            if (cfg.children[i].is_selected) {
              // self.childShapeAnimate(cfg, group, i)
            } else {
              if (cfg.children[i].is_hover) {
                // self.childShapeAnimate(cfg, group, i, false)
              }
            }
            break
          }
        }
      },
    });
    // 注册分支节点
    G6.registerNode("flow_option_diamond", {
      draw(cfg, group) {
        const size = cfg.size;
        // let width = size[0];
        let width = 0;
        const height = size[1];

        // if (cfg.label != g_config.normal_node.placeholder_default) {
        width = (cfg.label.split("").length + 2) * g_config.normal_node.font_size_default;
        if (width < 100) width = 100;
        // }

        cfg.size[0] = width

        const diamond = group.addShape("path", {
          zIndex: 1,
          attrs: {
            // path: [
            //   ["M", width / 2, -height / 2],
            //   ["L", width / 2 + 10, 0],
            //   ["L", width / 2, height / 2],
            //   ["L", -width / 2, height / 2],
            //   ["L", -width / 2 - 10, 0],
            //   ["L", -width / 2, -height / 2],
            //   ["Z"] // 封闭
            // ],
            path: [
              ["M", cfg.size[0] / 2, height],
              ["L", cfg.size[0] / 2 + 10, height / 2],
              ["L", cfg.size[0] / 2, 0],
              ["L", -cfg.size[0] / 2, 0],
              ["L", -cfg.size[0] / 2 - 10, height / 2],
              ["L", -cfg.size[0] / 2, height],
              ["L", cfg.size[0] / 2, height],
              ["Z"] // 封闭
            ],
            stroke: cfg.stroke || g_config.normal_node.stroke_color_default,
            fill: cfg.fill || g_config.normal_node.fill_color_default,
            lineWidth: g_config.normal_node.border_width_default
          }
        });
        // 添加边锚点
        if (!cfg.hide_add_arrow) {
          self.drawLinkPoints(cfg, group)
        }
        group.addShape("text", {
          zIndex: 1,
          attrs: {
            text: cfg.label,
            x: 0,
            // y: 0,
            y: cfg.size[1] / 2,
            // fill: g_config.normal_node.color_default,
            // fill:
            //   cfg.label === g_config.normal_node.placeholder_default ||
            //     cfg.label === "请输入病种名称"
            //     ? "#ABB7C5"
            //     : "#333",
            fill:cfg.color ? cfg.color : g_config.normal_node.placeholder_default,
            fontSize: g_config.normal_node.font_size_default,
            textAlign: "center",
            textBaseline: "middle",
            lineHeight: g_config.normal_node.line_height_default
          },
          name: "text-shape"
        });
        // shape.set("className", "opinionData");
        // 要点标记
        if (cfg.tags[0].files.length > 0 || cfg.tags[0].label) {
          self.drawParentKeyPointsTag(cfg, group)
        }
        return diamond;
      },
      afterDraw(cfg, group) {
        if (cfg.is_selected) {
          // self.diamondNodeAnimate(cfg, group)

        } else {
          if (cfg.is_hover) {
            // self.diamondNodeAnimate(cfg, group, false)
          }
        }
      }
    });
    // 注册边
    G6.registerEdge("cubic", {
      draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const distance = {
          x:
            startPoint.x == endPoint.x
              ? 0
              : Math.abs(endPoint.x - startPoint.x) > 20
                ? startPoint.x > endPoint.x
                  ? -10
                  : 10
                : 0.5 * (endPoint.x - startPoint.x),
          y:
            startPoint.y == endPoint.y
              ? 0
              : startPoint.y > endPoint.y
                ? -10
                : 100
        };
        const path = [
          [
            ["M", startPoint.x, startPoint.y],
            [
              "L",
              startPoint.x,
              0.5 * (endPoint.y - startPoint.y) +
              startPoint.y -
              (endPoint.y > startPoint.y ? 10 : -10)
            ],
            [
              "Q",
              startPoint.x,
              0.5 * (endPoint.y - startPoint.y) + startPoint.y,
              startPoint.x + distance.x,
              0.5 * (endPoint.y - startPoint.y) + startPoint.y
            ],
            [
              "L",
              endPoint.x - distance.x,
              0.5 * (endPoint.y - startPoint.y) + startPoint.y
            ],
            [
              "Q",
              endPoint.x,
              0.5 * (endPoint.y - startPoint.y) + startPoint.y,
              endPoint.x,
              0.5 * (endPoint.y - startPoint.y) +
              startPoint.y +
              (endPoint.y > startPoint.y ? 10 : -10)
            ],
            ["L", endPoint.x, endPoint.y]
          ],
          [
            ["M", startPoint.x, startPoint.y],
            ["L", endPoint.x - distance.x, startPoint.y],
            [
              "Q",
              endPoint.x,
              startPoint.y,
              endPoint.x,
              startPoint.y + (endPoint.y > startPoint.y ? 10 : -10)
            ],
            ["L", endPoint.x, endPoint.y]
          ]
        ];
        const type = group.addShape("path", {
          attrs: {
            stroke: g_config.normal_edge.stroke_default,
            source: startPoint,
            target: endPoint,
            endArrow: {
              path: "M 0,0 L 4,4 L 4,-4 Z",
              fill: g_config.normal_edge.stroke_default,
              d: 0
            },
            // path: cfg.site === 'bottom' ? path[1] : path[0],
            path: path[0],
            lineWidth: g_config.normal_edge.edge_line_width_default
          }
        });
        return type;
      }
    });
    // 添加边的行为
    G6.registerBehavior('click-add-edge', {
      // Set the events and the corresponding responsing function for this behavior
      getEvents() {
        return {
          // 'node:mousedown': 'onClick', // The event is canvas:click, the responsing function is onClick
          'node:mousedown': 'onMouseDown', // The event is canvas:click, the responsing function is onClick
          // 'mouseup': 'onMouseUp', // The event is canvas:click, the responsing function is onClick
          'node:mouseenter': 'onMouseEnter', // The event is canvas:click, the responsing function is onClick
          'node:mouseout': 'onMouseOut', // The event is canvas:click, the responsing function is onClick
          'edge:mouseup': 'onEdgeMouseUp', // The event is canvas:click, the responsing function is onClick
          // 'click': 'onClick', // The event is canvas:click, the responsing function is onClick
          mousemove: 'onMousemove', // The event is mousemove, the responsing function is onMousemove
          // 'edge:click': 'onEdgeClick', // The event is edge:click, the responsing function is onEdgeClick
          // 'edge:mouseup': 'onEdgeClick', // The event is edge:click, the responsing function is onEdgeClick
        };
      },
      // The responsing function for node:click defined in getEvents
      onMouseDown(ev) {
        const self_edge = this;
        const node = ev.item;
        const shape = ev.target;
        const graph = self.graph;
        let model = {}
        const className = shape.get('className')
        if (node) {
          model = node.getModel();
        }
        // 只有点击 add_age_point 时，
        if (className !== 'add_age_point') {
          return
        }
        // 如果存在未完成边，删除
        if (self_edge.edge && self_edge.edge._cfg != null) {
          let target = self_edge.edge.getTarget()
          if (target && target.x) {
            self_edge.graph.removeItem(self_edge.edge);
            self_edge.edge = null;
            self_edge.addingEdge = false;
            self_edge.target_node_id = null
            self_edge.source_node_id = null
            self.$refs.nodeSelectBoard.style.left = -1500 + 'px'
          }
        }



        // 添加边
        let edge_id = new Date().getTime().toString()

        self.current_edge_id = edge_id

        self_edge.edge = graph.addItem('edge', {
          id: edge_id,
          source: model.id,
          target: model.id,
        });
        self_edge.addingEdge = true
      },
      onMouseUp(ev) {
        const self_edge = this;
        const node = ev.item;
        // const shape = ev.target;
        const graph = self.graph;
        
        // const model = node.getModel();
        
        const point = { x: ev.x, y: ev.y };
        if (self_edge.addingEdge && self_edge.edge) {
          self_edge.graph.updateItem(self_edge.edge, {
            target: point,
          });

          if (node._cfg && node._cfg.type == 'edge') {
            // 出现添加节点的选择框,点击添加节点
            const nodeSelectBoardPoint = graph.getPointByCanvas(point.x, point.y)
            self.$refs.nodeSelectBoard.style.left = nodeSelectBoardPoint.x - 130 + 'px'
            self.$refs.nodeSelectBoard.style.top = Number(nodeSelectBoardPoint.y) + 130 + 'px'
            self.clearNodeSelectBoard()
          }
          self_edge.addingEdge = false
        }
      },
      onMouseEnter(ev) {
        // const self_edge = this;
        const node = ev.item;
        // const shape = ev.target;
        // const graph = self.graph;
        const model = node.getModel();
        self.edge_target_id = model.id
      },
      onMouseOut(ev) {
        // const self_edge = this;
        // const node = ev.item;
        // const shape = ev.target;
        // const graph = self.graph;
        // const model = node.getModel();
        self.edge_target_id = null
      },
      onEdgeMouseUp(ev) {
        const self_edge = this;
        const node = ev.item;
        // const shape = ev.target;
        const graph = self.graph;
        // const model = node.getModel();
        const point = { x: ev.x, y: ev.y };

        if (self_edge.addingEdge && self_edge.edge) {

          if (self.edge_target_id) {
            // 如果是自己连自己,删除该线
            let edge_source_id = self_edge.edge.getSource()._cfg.id
            if (edge_source_id == self.edge_target_id) {
              self_edge.graph.removeItem(self_edge.edge);
              self_edge.edge = null
              self_edge.addingEdge = false
              return
            }
            // 连节点
            self_edge.graph.updateItem(self_edge.edge, {
              target: self.edge_target_id,
            });
            // self.undoList.push([
            self.redoList.push([
              {
                type: "edge",
                operation:"add",
                model: self_edge.edge.getModel()
              }
            ])
            self_edge.addingEdge = false
          } else {
            self_edge.graph.updateItem(self_edge.edge, {
              target: point,
            });
            if (node._cfg && node._cfg.type == 'edge') {
              // 出现添加节点的选择框,点击添加节点
              const nodeSelectBoardPoint = graph.getPointByCanvas(point.x, point.y)
              self.$refs.nodeSelectBoard.style.left = nodeSelectBoardPoint.x - 130 + 'px'
              self.$refs.nodeSelectBoard.style.top = Number(nodeSelectBoardPoint.y) + 'px'
              self.clearNodeSelectBoard()
            }
            self_edge.addingEdge = false
          }
        }
      },
      onClick(ev) {
        const self_edge = this;
        const node = ev.item;
        const shape = ev.target;
        const graph = self.graph;

        // console.log(node)
        // The position where the mouse clicks
        // const point = { x: ev.x, y: ev.y };
        
        const model = node.getModel();
        const className = shape.get('className')

        if (className !== 'add_age_point' && !self_edge.addingEdge) {
          return
        }


        if (className == 'add_age_point' && self_edge.edge && self_edge.edge._cfg != null) {
          let target = self_edge.edge.getTarget()
          if (target && target.x) {
            self_edge.graph.removeItem(self_edge.edge);
            self_edge.edge = null;
            self_edge.addingEdge = false;
            self_edge.target_node_id = null
            self_edge.source_node_id = null
            self.$refs.nodeSelectBoard.style.left = -1500 + 'px'
          }
        }


        if (self_edge.addingEdge && self_edge.edge) {
          self_edge.target_node_id = model.id
          // 处理 边 的 target 和 node 是一个节点
          // 这种情况直接将边删除
          if (self_edge.target_node_id == self_edge.source_node_id) {
            self_edge.graph.removeItem(self_edge.edge);
            self_edge.edge = null;
            self_edge.addingEdge = false;
            self_edge.target_node_id = null
            self_edge.source_node_id = null
            return
          }
          // 更新边的target
          graph.updateItem(self_edge.edge, {
            type: "cubic",
            target: model.id,
          });



          self_edge.edge = null;
          self_edge.addingEdge = false;
        } else {
          // Add anew edge, the end node is the current node user clicks
          let edge_id = new Date().getTime().toString()
          self.current_edge_id = edge_id

          self_edge.source_node_id = model.id // 保存边的 source_node_id

          self_edge.edge = graph.addItem('edge', {
            id: edge_id,
            source: model.id,
            target: model.id,
          });
          self_edge.addingEdge = true;
        }
      },
      // The responsing function for mousemove defined in getEvents
      onMousemove(ev) {
        const self_edge = this;
        // The current position the mouse clicks
        const point = { x: ev.x, y: ev.y };
        if (self_edge.addingEdge && self_edge.edge) {
          // Update the end node to the current node the mouse clicks
          self_edge.graph.updateItem(self_edge.edge, {
            target: point,
          });
        }

      },
      // The responsing function for edge:click defined in getEvents
      onEdgeClick(ev) {
        console.log("点击边")
        const add_self = this;

        // const currentEdge = ev.item;
        // if (self.addingEdge && self.edge === currentEdge) {
        // self.graph.removeItem(self.edge);
        // self.edge = null;
        // self.addingEdge = false;

        const point = { x: ev.x, y: ev.y };

        add_self.graph.updateItem(add_self.edge, {
          target: point,
        });

        add_self.addingEdge = false;

      },
    });
    // Initial data
    // 初始化图
    this.init()


  },
  methods: {
    init() {
      let self = this
      let base_config = {
        container: "container",
        width: 1000,
        height: 700,
        groupByTypes: false,
        modes: {
          default: ["drag-node", "click-add-edge", 'drag-combo']
        },
        defaultNode: {
          type: "flow_rect",
          size: [g_config.rect_node.width_default, g_config.rect_node.height_default],
          labelCfg: {
            style: {
              fill: g_config.normal_node.color_default,
              fontSize: g_config.normal_node.font_size_default
            }
          },
          style: {
            fill: g_config.normal_node.fill_color_default,
            stroke: g_config.normal_node.stroke_color_default,
            lineWidth: g_config.normal_node.border_width_default,
            radius: g_config.normal_node.border_radius_default
          },
          anchorPoints: g_config.normal_node.anchors_default
        },
        defaultEdge: {
          type: g_config.normal_edge.type,
          style: {
            stroke: g_config.normal_edge.stroke_default,
            lineWidth: g_config.normal_edge.edge_line_width_default
          }
        },
        defaultCombo: {
          type: 'rect',
          size: [0, 0], // Combo 的最小大小
          style: {
            lineWidth: 1,
            // zIndex:-1,
            fill: "#fff",
            opacity: 0.5
          }
        },
        comboStateStyles: {
          // the style configurations for the hover state on the combo
          hover: {
            fill: "#000",
          },
          hover1: {
            lineWidth: 0
          }
        },
      }
      if (self.dragcanvas) {
        base_config.modes.default.push("drag-canvas")
      }

      self.graph = new G6.Graph(base_config);

      /**
       * 节点事件
       */
      // 进入节点
      self.graph.on("node:mouseenter", evt => {
        this.evt = evt;
        const shape = evt.target;
        const node = evt.item;
        const model = node.getModel();

        const node_type = model.node_type;
        const point = this.graph.getCanvasByPoint(model.x, model.y);

        const height = node._cfg.keyShape.attrs.height
        model.hide_add_arrow = false;
        model.is_hover = true
        /**
         * node_type: ['normal' ,'root' ,'gather']
         */
        if (node_type) {
          switch (node_type) {
            case g_config.normal_node.node_characteristic_list[0]:
              // console.log("进入节点" + g_config.normal_node.node_characteristic_list[0]);
              break;
            case g_config.normal_node.node_characteristic_list[1]:
              // console.log("进入节点" + g_config.normal_node.node_characteristic_list[1]);
              break;
            case g_config.normal_node.node_characteristic_list[2]:
              // console.log("进入节点" + g_config.normal_node.node_characteristic_list[2]);
              break;
            default:
              break;
          }
        }
        node.refresh();
      });

      // 离开节点
      self.graph.on("node:mouseleave", evt => {
        // 将 tip相关 tagid 置 0 ，位置 -1500+'px'
        self.current_tag_id = 0
        self.$refs.tag_tip_board.style.left = -1500 + 'px'

        this.evt = evt;

        const shape = evt.target;
        const node = evt.item;
        let model = node.getModel();
        const node_type = model.node_type;
        model.hide_add_arrow = true;
        model.is_hover = false
        if (node_type) {
          switch (node_type) {
            case g_config.normal_node.node_characteristic_list[0]:
              // console.log("离开节点" + g_config.normal_node.node_characteristic_list[0]);
              break;
            case g_config.normal_node.node_characteristic_list[1]:
              // console.log("离开节点" + g_config.normal_node.node_characteristic_list[1]);
              break;
            case g_config.normal_node.node_characteristic_list[2]:
              // console.log("离开节点" + g_config.normal_node.node_characteristic_list[2]);
              break;
            default:
              break;
          }
        }
        node.refresh();
        return;
      });
      self.cid = ""
      // 点击节点
      self.graph.on("node:click", evt => {
        this.evt = evt;
        const shape = evt.target;
        const node = evt.item;
        const model = node.getModel()
        const draw_type = model.type
        const className = shape.get("className")
        const element_type = shape.get("element_type")
        const element_id = shape.get("element_or_illness_id")
        const childRectIndex = shape.get("childRectIndex")
        if (this.canClick) {
          if (model.children && model.children.length) {
            if (childRectIndex || childRectIndex === 0) {
              if (model.children[childRectIndex].color == "#ffffff") {
                model.children[childRectIndex].color = "#333333"
                model.children[childRectIndex].fill = "#ffffff"
                model.children[childRectIndex].stock = "#333333"
                node.refresh();
              } else {
                model.children[childRectIndex].color = "#ffffff"
                model.children[childRectIndex].fill = "#D05F00"
                model.children[childRectIndex].stock = "#D05F00"
                node.refresh();
              }
            }
          } else {
            if (model.color == "#ffffff") {
              model.color = "#333333"
              model.fill = "#ffffff"
              model.stock = "#333333"
              node.refresh();
            } else {
              model.color = "#ffffff"
              model.fill = "#D05F00"
              model.stock = "#D05F00"
              node.refresh();
            }
          }
        }
        
        // 点击收起节点，返回
        if (className == 'packUp') {
          model.state = model.state == 1 ? 2 : 1
          self.graph.refreshPositions()
          node.refresh()
          self.refreshGraph()
          return
        }
        // 如果是在查看提纲
        if (this.outlinesee) {
          // 普通节点
          if (draw_type == 'flow_rect' || draw_type =='flow_option_diamond') {
            if(className == 'markTag_text' || className == 'markTag') return
            if (model.tags.length > 1) {
              this.showNodeInfoSingle(model)
            } else if ((model.tags[0].label || model.tags[0].files.length > 0)) {
              this.is_show_node_info = true
              this.current_node_info.key_points = model.tags[0]
              this.current_node_info.title = model.true_label || model.label
              this.current_node_info.data = []
              this.current_node_info.type = ''
              return
            }


          } else {
            // 单独处理只有要点标记的情况
            if (!element_type) {
              if (childRectIndex === undefined && (model.tags[0].label || model.tags[0].files.length > 0)) {
                this.is_show_node_info = true
                this.current_node_info.key_points = model.tags[0]
                this.current_node_info.title = model.true_label || model.label
                this.current_node_info.data = []
                this.current_node_info.type = ''
                return
              }
              if (model.children.length > 0 && childRectIndex && (model.children[childRectIndex].tags[0].label || model.children[childRectIndex].tags[0].files.length > 0)) {
                this.is_show_node_info = true
                this.current_node_info.key_points = model.children[childRectIndex].tags[0]
                this.current_node_info.title = model.children[childRectIndex].true_label
                this.current_node_info.data = []
                this.current_node_info.type = ''
                return
              }

            }

            // 其他要素类型
            if (!element_type) return

            if (className == "gatherChildRect") {

              this.showNodeInfoGather(element_type, element_id, model, childRectIndex)

            }
          }
          // return
        }

        //如果正在按住 g 进行节点选择 
        if (this.is_select_node_to_combo) {
          let node_id = model.id
          let combos_nodes_index = self.combos_nodes.indexOf(node_id)
          // // 创建comboA
          if (self.combos_nodes.length == 0) {
            self.combos_nodes.push(node_id)
            self.graph.createCombo('comboB', [node_id])
          }
          else {
            // let cid = String(new Date().getTime() + 1)
            self.graph.uncombo('comboB')
            console.log(self.graph.getCombos())
            if (combos_nodes_index != -1) {
              console.log("从 comboB 删除子节点")
              self.combos_nodes.splice(combos_nodes_index, 1)
              if (self.combos_nodes.length == 0) {
                return
              }
            } else {
              self.combos_nodes.push(node_id)
            }
            self.graph.createCombo('comboB', self.combos_nodes)
          }
          return
        }


        // 编辑提纲

        // 清空当前操作子shape的索引
        self.current_edit_child_index = -1

        if (className == 'add_age_point') {
          return false
        }

        if (self.last_node_id != model.id) {
          let lastNode = this.graph.findById(this.model.id)
          if (lastNode) {
            lastNode.getModel().is_selected = false
            if (lastNode.getModel().children) {
              lastNode.getModel().children.forEach(child => {
                child.is_selected = false
              })
            }
            lastNode.refresh()
          }
        }

        self.last_node_id = model.id
        // 选中节点
        model.is_selected = true
        // 编辑区域
        model.current_edit = 'outer'
        // 选中子shape，去掉组合节点选中状态
        if (model.children) {
          model.children.forEach(child => {
            child.is_selected = false
          })
        }
        // 点击组合节点内部 child_shape
        if (className == "gatherChildRect") {
          model.is_selected = false

          model.current_edit = 'inner'
          // childRectIndex
          let childRectIndex = shape.get("childRectIndex")
          if (model.children && model.children.length && childRectIndex) {
            model.children[childRectIndex].is_selected = true
          }
          self.current_edit_child_index = childRectIndex
          // 请求节点关联数据（在）

        }

        self.model = model
        self.is_edit = true
        self.refreshGraph()

      });

      this.graph.on("node:mouseover", evt => {
        this.evt = evt;
        const shape = evt.target;
        const node = evt.item;
        const model = node.getModel()
        const className = shape.get("className")
        const element_or_illness_id = shape.get("element_or_illness_id")
        let element_type = shape.get("element_type")
        if (className == 'markTag' || className == 'markTag_text') {
          const point = { x: evt.x, y: evt.y };
          if (this.current_tag_id != element_or_illness_id) {
            this.current_tag_id = element_or_illness_id
            let canvas_position = this.graph.getClientByPoint(point.x, point.y);
            // 要点说明单独处理
            // 父节点 // 子child_shape
            if (element_type == 'key_points' || element_type == 'child_key_points') {
              let files = [] // 文件
              let label = '' // 要点说明
              if (element_type == 'key_points') {
                files = model.tags[0].files
                label = model.tags[0].label
              } else if (element_type == 'child_key_points') {
                let index = shape.get("childRectIndex")
                console.log(index)
                console.log(model.children[index])
                files = model.children[index].tags[0].files
                label = model.children[index].tags[0].label
              }
              let img_num = 0
              let audio_num = 0
              let video_num = 0
              files.forEach(file => {
                switch (file.type) {
                  case 'img':
                    img_num += 1
                    break;
                  case 'audio':
                    audio_num += 1
                    break;
                  case 'video':
                    video_num += 1
                    break;
                  default:
                    break;
                }
              })
              this.current_tag_info.type = 'key_points'
              this.current_tag_info.data = []
              if (label) {
                this.current_tag_info.data.push({
                  type: "文字说明：",
                  data: label
                })
              }
              if (img_num > 0) {
                this.current_tag_info.data.push({
                  type: "图片说明：",
                  data: img_num + '张'
                })
              }
              if (audio_num > 0) {
                this.current_tag_info.data.push({
                  type: "音频说明：",
                  data: audio_num + '条'
                })
              }
              if (video_num > 0) {
                this.current_tag_info.data.push({
                  type: "视频说明：",
                  data: video_num + '条'
                })
              }
              self.$refs.tag_tip_board.style.left = canvas_position.x + 20 + 'px'
              self.$refs.tag_tip_board.style.top = canvas_position.y - 130 + 'px'
              return
            }

            if (this.illness_type_list.indexOf(element_type) != -1) {
              element_type = "illness"
            }
            // 如果不是同一个tag，那么请求数据
            PostData("case/getBasisConciseShow", {
              case_id: parseInt(sessionStorage.getItem("CASEID")),
              type: element_type,
              element_id: shape.get("element_or_illness_id"),
              illness_id: shape.get("element_or_illness_id")
            }).then(res => {
              this.current_tag_info.type = element_type
              this.current_tag_info.length = res.data.count
              this.current_tag_info.data = res.data.data
              this.$refs.tag_tip_board.style.left = canvas_position.x + 20 + 'px'
              this.$refs.tag_tip_board.style.top = canvas_position.y - 130 + 'px'
            })
          }
        } else {
          this.current_tag_id = 0
          this.$refs.tag_tip_board.style.left = -1500 + 'px'
        }
      })
      // 节点拖拽结束
      // this.graph.on("node:dragend", evt => {
      //   this.graph.refreshPositions()
      //   this.updateCanvasSize()
      //   this.data = this.graph.save()
      // })
      /**
       * combo 事件
       */
      this.graph.on('combo:mouseenter', evt => {
        const { item } = evt;
        this.graph.setItemState(item, 'hover', true);
      });

      this.graph.on('combo:mouseleave', evt => {
        const { item } = evt;
        this.graph.setItemState(item, 'hover', false);
      });
      /**
       * 键盘事件
       */
      // 键盘按下
      this.graph.on("keydown", evt => {
        let key = evt.key
        // 当按g时，开始 选取node 到 combo  && this.combos_nodes.length > 0
        if (String(key).toLowerCase() === 'g') {
          this.is_select_node_to_combo = true
        }
        // 当按 esc时，取消 combo
        if (String(key).toLowerCase() === 'escape') {
          const combo = this.graph.findById('comboB')
          if (!combo._cfg) return
          this.combos_nodes = []
          this.graph.uncombo(combo)
        }
      })
      // 键盘抬起
      this.graph.on("keyup", evt => {
        this.is_select_node_to_combo = false
      })
      /**
       * canvas事件
       */
      // 点击事件
      this.graph.on("click", evt => {
        this.evt = evt;
        const node = evt.item;
        if (node === null) {
          this.is_edit = false
          this.is_show_node_info = false
          this.clearSelected()
        }
      });

      /**
       * 时机监听
       */
      this.graph.on("afteradditem", evt => {
        // console.log(evt)
      })

    },
    // 单独节点信息
    showNodeInfoSingle(model){
      this.is_show_node_info = true
      this.show_node_info_loading = true
      let element_type = model.tags[1].type
      let element_id = model.tags[1].id
     
      if (this.illness_type_list.indexOf(element_type) != -1) {
        PostData("case/getBasisByIllness", {
          case_id: parseInt(sessionStorage.getItem("CASEID")),
          illness_id: element_id
        }).then(res => {
          this.$refs.nodeMainBoard.scrollTop = 0
          this.show_node_info_loading = false
          if (Object.keys(res.data).length == 0) {
            this.is_show_node_info = false
            return
          }
          this.current_node_info.diagnosis_key = 1
          this.collapse_arr = []

          this.current_node_info.data = res.data
          this.current_node_info.type = 'illness'
          this.current_node_info.key_points = model.tags[0]
          this.current_node_info.title = model.label
        }).catch(e => {
          this.show_node_info_loading = false
        })
      }
      else {
        // 要素
        PostData("case/getBasisDetailShow", {
          case_id: parseInt(sessionStorage.getItem("CASEID")),
          type: element_type,
          element_id: element_id
        }).then(res => {
          this.$refs.nodeMainBoard.scrollTop = 0
          this.show_node_info_loading = false
          if (Object.keys(res.data).length == 0) {
            this.is_show_node_info = false
            return
          }
          this.current_node_info.diagnosis_key = 1
          this.collapse_arr = []

          this.current_node_info.data = Object.freeze(res.data)
          this.current_node_info.type = element_type
          this.current_node_info.key_points = model.tags[0]
          this.current_node_info.title = model.label
        }).catch(e => {
          this.show_node_info_loading = false
        })
      }
    },
    // 组合节点信息
    showNodeInfoGather(element_type, element_id, model, childRectIndex) {
      // 病种
      this.is_show_node_info = true
      this.show_node_info_loading = true
      
      if (this.illness_type_list.indexOf(element_type) != -1) {
        PostData("case/getBasisByIllness", {
          case_id: parseInt(sessionStorage.getItem("CASEID")),
          illness_id: element_id
        }).then(res => {
          this.$refs.nodeMainBoard.scrollTop = 0
          this.show_node_info_loading = false
          if (Object.keys(res.data).length == 0) {
            this.is_show_node_info = false
            return
          }
          this.current_node_info.diagnosis_key = 1
          this.collapse_arr = []

          this.current_node_info.data = res.data
          this.current_node_info.type = 'illness'
          this.current_node_info.key_points = model.children[childRectIndex].tags[0]
          this.current_node_info.title = model.children[childRectIndex].true_label
        }).catch(e => {
          this.show_node_info_loading = false
        })
      }
      else {
        // 要素
        PostData("case/getBasisDetailShow", {
          case_id: parseInt(sessionStorage.getItem("CASEID")),
          type: element_type,
          element_id: element_id
        }).then(res => {
          this.$refs.nodeMainBoard.scrollTop = 0
          this.show_node_info_loading = false
          if (Object.keys(res.data).length == 0) {
            this.is_show_node_info = false
            return
          }
          this.current_node_info.diagnosis_key = 1
          this.collapse_arr = []

          this.current_node_info.data = Object.freeze(res.data)
          this.current_node_info.type = element_type
          this.current_node_info.key_points = model.children[childRectIndex].tags[0]
          this.current_node_info.title = model.children[childRectIndex].true_label
        }).catch(e => {
          this.show_node_info_loading = false
        })
      }
    },
    changeDegree(value) {
      this.data.nodes[0].degree = value.toString()
    },
    // 添加节点
    addNode(item) {
      const edge = this.graph.findById(this.current_edge_id);
      const position = edge.getTarget()
      let id = new Date().getTime().toString()
      const model = {
        id,
        x: position.x,
        y: position.y,
        comboId: "",
        type: item.type,
        node_type: item.node_type,
        label: item.type == 'flow_gather_rect' ?
          g_config.gather_node.placeholder_default :
          g_config.normal_node.placeholder_default,
        true_label: "",
        hide_add_arrow: true,
        color: g_config.normal_node.color_default,
        mark_id: 0, // 标注id
        tags: [
          {
            type: 'key_points',
            label: "",
            files: [],
          }
        ],
        key_points: "", // 要点说明
        files: [], // 文件说明
        current_edit: 'inner',
        is_selected: false,
        state: 1, //  1 展开 2 收起
        children: item.node_type != 'gather' ? [] : [
          {
            parent_node_id: id,
            child_shape_id: (new Date().getTime() + 1).toString(),
            childRectIndex: 0,
            // label: "合集子节点".split("").join("\n"),
            // true_label: "合集子节点",
            label: "",
            true_label: "",
            is_selected: false,
            // 样式
            style: {
              width: g_config.gather_node.child_width_default,
              height: g_config.gather_node.child_height_default
            },
            tags: [
              {
                type: 'child_key_points',
                label: "",
                files: [],
              }
            ]
          },
          {
            parent_node_id: id,
            child_shape_id: (new Date().getTime() + 2).toString(),
            childRectIndex: 1,
            // label: "合集子节点".split("").join("\n"),
            // true_label: "合集子节点",
            label: "",
            true_label: "",
            is_selected: false,
            // 样式
            style: {
              width: g_config.gather_node.child_width_default,
              height: g_config.gather_node.child_height_default
            },
            tags: [
              {
                type: 'child_key_points',
                label: "",
                files: [],
              }
            ]
          }
        ]
      }
      this.graph.addItem("node", model)

      // 此处进行边的更新
      this.graph.updateItem(edge, {
        target: id,
      });

      // 将节点和边加入到 undoList

      // this.undoList.push([
      this.redoList.push([
        {
          type: "node",
          operation:"add",
          model: model
        },
        {
          type: "edge",
          operation:"add",
          model: this.graph.findById(this.current_edge_id).getModel()
        }
      ])

      this.updateCanvasSize()

      // 将节点框移走
      this.$refs.nodeSelectBoard.style.left = '-1500px'
    },
    // 取消添加节点
    cancelAddNode() {
      const edge = this.graph.findById(this.current_edge_id);
      this.graph.removeItem(edge);
      this.$refs.nodeSelectBoard.style.left = '-1500px'
    },
    // 添加 childshape
    addChildShape() {
      this.model.children.push({
        parent_node_id: this.model.id,
        child_shape_id: new Date().getTime().toString(),
        childRectIndex: 0,
        // label: "合集子节点".split("").join("\n"),
        // true_label: '合集子节点',
        label: "",
        true_label: "",
        is_selected: false,
        // 样式
        style: {
          width: g_config.gather_node.child_width_default,
          height: g_config.gather_node.child_height_default
        },
        tags: [{
          type: 'child_key_points',
          label: "",
          files: []
        }]
      })
      this.sortChildShapesIndex()
      this.graph.findById(this.model.id).refresh()
      // this.graph.layout()
      this.refreshGraph()
    },
    // 删除节点
    deleteNode() {

      // 将节点和边加入到 redoList
      let current_redo = []
      current_redo.push({
        type: "node",
        operation: "delete",
        model: this.model
      })

      const id = this.model.id
      const item = this.graph.findById(id);
      const edges = item.getEdges();
      edges.forEach(edge => {
        current_redo.push({
          type: "edge",
          operation:"delete",
          model: edge.getModel()
        })
        let id = edge.get('id')
        item.removeEdge(id)
      })

      this.redoList.push(current_redo);
      this.graph.removeItem(item);
    },
    // 删除子 shape
    deleteShape(current_edit_child_index) {
      this.model.children.splice(current_edit_child_index, 1)
      this.graph.findById(this.model.id).refresh()
      this.refreshGraph()
    },
    // 整理 childshape  childRectIndex
    sortChildShapesIndex() {
      this.model.children.forEach((child, index) => {
        child.childRectIndex = index
      })
    },
    // 修改节点标注
    changeNodeMark(item) {
      if (this.model.mark_id == item.id) {
        this.model.mark_id = 0
        this.model.mark_type = item.type
        this.model.stroke = g_config.normal_node.stroke_color_default
        this.model.fill = g_config.normal_node.fill_color_default
        // this.model.label = g_config.normal_node.placeholder_default
      } else {
        this.model.mark_id = item.id
        this.model.mark_type = item.type
        this.model.stroke = item.color
        this.model.fill = item.bg
        if (this.model.node_type == 'gather') {
          // 判断是否被修改
          let curr_label = this.model.label
          if (this.mark_name_list.indexOf(curr_label) != -1) {
            this.model.label = item.label
            this.model.true_label = item.label
          }
        }
      }


      this.updateNode()
    },
    // 修改canvas的大小
    updateCanvasSize() {
      let data = this.graph.save()
      let max__node_h = Math.max(...data.nodes.map(x => x.y));
      let max__node_w = Math.max(...data.nodes.map(x => x.x));
      // let graph_h = max__node_h > this.graphSize.height ? max__node_h + 500 : this.graphSize.height
      // let graph_w = max__node_w > 500 ? max__node_w + 300 : 800
      this.graph.changeSize(this.graphSize.width || max__node_w + 300, max__node_h + 200);
      this.refreshGraph()
    },
    /**
     * 
     * @param {*} node_type parent child_shape 父节点 子shape
     * @param {*} edit_type label 或者 key_points
     * @param {*} val 对应值
     * @param {*} childIdx  子shape 索引
     */
    updateNode(node_type, edit_type, val, childIdx) {
      console.log(node_type, edit_type, val, childIdx)
      if (node_type == 'parent') {
        
        this.model.true_label = val.split('\n').join("")
      }
      else {
        if (childIdx >= 0) {
          if (edit_type == "label") {
            this.model.children[childIdx].true_label = val
            val = val.split("\n").join("").split("").join("\n")
            this.model.children[childIdx].label = val
          }
          else if (edit_type == "key_ponit") {
            this.model.children[childIdx].tags[0].label = val
          }
          else {
            this.model[edit_type] = val
          }
        }
      }

      tool.debounce(this.graph.findById(this.model.id).refresh(), 200)
      tool.debounce(this.graph.refresh(), 200)

    },
    // updateLayout() {
    //   this.graph.layout()
    // },
    refreshGraph() {
      this.graph.refresh()
    },
    clearGraph(){
      console.log('clear');
      this.graph.destroy()
    },
    updateGraph() {
      const zoom = this.graph.getZoom()
      // this.data = this.graph.save()
      // this.graph.clear()
      // this.graph.read(this.data)
      this.graph.zoom(zoom)
    },
    // 父节点选中动画
    parentNodeAnimate(cfg, group, repeat = true) {
      const size = cfg.size || [0, 0]
      const circle = group.addShape('rect', {
        zIndex: -1,
        attrs: {
          x: -size[0] / 2,
          // y: -size[1] / 2,
          y: 0,
          fill: cfg.stroke ? cfg.stroke : g_config.normal_node.stroke_color_default,
          radius: 5,
          opacity: 0.6,
          width: size[0],
          height: size[1],
        },
        name: 'back1-shape',
      });
      group.sort();
      circle.animate(
        {
          x: -size[0] / 2 - 5,
          // y: -size[1] / 2 - 5,
          y: - 5,
          width: size[0] + 10,
          height: size[1] + 10,
        },
        {
          easing: 'easeCubic',
          repeat: repeat, // 动画重复
          duration: 800,
        },
      )
    },
    // childShape 选中动画
    childShapeAnimate(cfg, group, chidshape_idx, repeat = true) {
      const size = cfg.children[chidshape_idx].size || [0, 0]
      const circle = group.addShape('rect', {
        zIndex: 1,
        attrs: {
          x: g_config.gather_node.child_width_default * chidshape_idx +
            g_config.gather_node.child_spacing * (chidshape_idx + 1) - cfg.size[0] / 2,
          // y: g_config.gather_node.child_spacing + 5 - cfg.size[1] / 2,
          y: g_config.gather_node.child_spacing + 5,
          fill: cfg.stroke ? cfg.stroke : g_config.normal_node.stroke_color_default,
          radius: 5,
          opacity: 0.6,
          width: g_config.gather_node.child_width_default,
          height: size[1],
        },
        name: 'back1-shape',
      });
      group.sort();
      circle.animate(
        {
          x: g_config.gather_node.child_width_default * chidshape_idx +
            g_config.gather_node.child_spacing * (chidshape_idx + 1) - 5 - cfg.size[0] / 2,
          // y: g_config.gather_node.child_spacing - cfg.size[1] / 2,
          y: g_config.gather_node.child_spacing,
          width: g_config.gather_node.child_width_default + 10,
          height: size[1] + 10,
        },
        {
          easing: 'easeCubic',
          repeat: repeat, // 动画重复
          duration: 800,
        },
      )
    },
    // 分支点选中动画
    diamondNodeAnimate(cfg, group, repeat = true) {
      let height = cfg.size[1];
      let width = cfg.size[0]
      if (cfg.label != g_config.normal_node.placeholder_default) {
        width = (cfg.label.split("").length + 2) * g_config.normal_node.font_size_default;
        if (width < 100) width = 100;
      }
      const diamond = group.addShape("path", {
        attrs: {
          zIndex: -1,
          // path: [
          //   ["M", width / 2, -height / 2],
          //   ["L", width / 2 + 10, 0],
          //   ["L", width / 2, height / 2],
          //   ["L", -width / 2, height / 2],
          //   ["L", -width / 2 - 10, 0],
          //   ["L", -width / 2, -height / 2],
          //   ["Z"] // 封闭
          // ],
          path: [
            ["M", width / 2, height],
            ["L", width / 2 + 10, height / 2],
            ["L", width / 2, 0],
            ["L", -width / 2, 0],
            ["L", -width / 2 - 10, height / 2],
            ["L", -width / 2, height],
            ["L", width / 2, height],
            ["Z"] // 封闭
          ],
          stroke: cfg.stroke || g_config.normal_node.stroke_color_default,
          fill: cfg.fill || g_config.normal_node.fill_color_default,
          lineWidth: g_config.normal_node.border_width_default
        }
      });
      group.sort();
      diamond.animate({
        lineWidth: g_config.normal_node.border_width_default + 5,
        stroke: "rgba(0,0,0,0.3)"
      }, {
        easing: 'easeCubic',
        repeat: repeat, // 动画重复
        duration: 800,
      })
    },
    // 画父节点要点标记
    drawParentKeyPointsTag(cfg, group) {
      const size = cfg.size || [0, 0]
      let tags = cfg.tags
      let current_draw_index = 0
      for (let i = 0; i < tags.length; i++) {
        if (i == 0) {
          if (!tags[0].label && !tags[0].files.length > 0) {
            continue
          }
        }
        group.addShape('circle', {
          zIndex: 1,
          attrs: {
            x: size[0] / 2 - current_draw_index * g_config.normal_tag.tag_r * 2,
            // y: -size[1] / 2,
            y: 0,
            fill: g_config.normal_tag.tag_list_map[tags[i].type].fill || '#fff',
            r: g_config.normal_tag.tag_r,
          },
          className: "markTag",
          element_type: tags[i].type,
          element_or_illness_id: tags[i].id || -1,
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'circle-shape',
        });
        group.addShape('text', {
          zIndex: 1,
          attrs: {
            text: g_config.normal_tag.tag_list_map[tags[i].type].label || "",
            x: size[0] / 2 - current_draw_index * g_config.normal_tag.tag_r * 2,
            // y: -size[1] / 2,
            y: 0,
            fill: "#fff",
            fontSize: g_config.normal_node.font_size_default * 0.8,
            textAlign: "center",
            textBaseline: "middle",
            lineHeight: g_config.normal_node.line_height_default
          },
          element_type: tags[i].type,
          element_or_illness_id: tags[i].id || -1,
          className: "markTag_text",
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'text-shape',
        });
        current_draw_index += 1
      }
    },
    // 画子节点要点标记
    drawChildShapeKeyPointsTag(cfg, group, index) {
      // 拿到tag
      let children = cfg.children
      let tags = children[index].tags || [];
      // 实际渲染的 tag 索引
      let cur_tag_index = 0
      tags.forEach((tag, tagIdx) => {
        if (!tag.label && tag.files.length == 0) {
          return
        }
        // console.log(tag)
        let type = tag.type;
        // console.log(g_config.normal_tag.tag_list_map[type])
        // console.log(type)
        // console.log(g_config.normal_tag.tag_list_map[type].fill)
        group.addShape("circle", {
          zIndex: 4,
          attrs: {
            x:
              g_config.gather_node.child_width_default * (index + 1) +
              g_config.gather_node.child_spacing * (index + 1) - cfg.size[0] / 2,
            // y: 2 * (g_config.normal_tag.tag_r) * (tagIdx + 1) + g_config.normal_tag.tag_r - cfg.size[1] / 2,
            y: 2 * (g_config.normal_tag.tag_r) * (cur_tag_index + 1) + g_config.normal_tag.tag_r * (cur_tag_index + 1),
            // y:
            //   height / 2 +
            //   (true_chat_length * g_config.normal_node.font_size_default) / 2 +
            //   // font_size_default +
            //   (tagIdx + 1) * (g_config.normal_tag.tag_r + 2) * 2,
            r: g_config.normal_tag.tag_r,
            fill: g_config.normal_tag.tag_list_map[type].fill,
            stroke: g_config.normal_tag.tag_list_map[type].fill,
            cursor: "pointer"
          },
          className: "markTag",
          childRectIndex: index,
          element_or_illness_id: tag.id,
          element_type: type
        });
        group.addShape("text", {
          zIndex: 5,
          attrs: {
            x:
              g_config.gather_node.child_width_default * (index + 1) +
              g_config.gather_node.child_spacing * (index + 1) - cfg.size[0] / 2,
            // y: 2 * (g_config.normal_tag.tag_r) * (tagIdx + 1) + g_config.normal_tag.tag_r - cfg.size[1] / 2,
            y: 2 * (g_config.normal_tag.tag_r) * (cur_tag_index + 1) + g_config.normal_tag.tag_r * (cur_tag_index + 1),
            // y:
            //   height / 2 +
            //   (true_chat_length * g_config.normal_node.font_size_default) / 2 +
            //   // font_size_default +
            //   (tagIdx + 1) * (g_config.normal_tag.tag_r + 2) * 2,
            // stroke: g_config.normal_pack.pack_fill_default,
            fill: "#fff",
            fontSize: g_config.normal_node.font_size_default * 0.8,
            textAlign: "center",
            textBaseline: "middle",
            text: g_config.normal_tag.tag_list_map[type].label,
            lineHeight: g_config.normal_node.line_height_default,
            cursor: "pointer"
          },
          className: "markTag_text",
          element_or_illness_id: tag.id,
          element_type: type
        });
        cur_tag_index++
      });
    },
    // 画节点锚点
    drawLinkPoints(cfg, group) {
      if (!this.outlinesee) {
        group.addShape("circle", {
          zIndex: 1,
          attrs: {
            x: 0,
            // y: height / 2,
            y: cfg.size[1],
            fill: g_config.link_points.fill_color_default,
            r: g_config.link_points.link_points_r,
            cursor: 'crosshair'
          },
          className: "add_age_point",
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: "image-shape"
        });
        group.addShape("text", {
          zIndex: 1,
          attrs: {
            text: g_config.link_points.link_points_label,
            x: 0,
            // y: height / 2,
            y: cfg.size[1],
            fill: '#fff',
            fontSize: g_config.link_points.font_size_default,
            textAlign: "center",
            textBaseline: "middle",
            lineHeight: g_config.link_points.line_height_default,
            cursor: 'crosshair'
          },
          className: "add_age_point",
          name: "text-shape"
        })
      }

    },
    // 清空选中状态
    clearSelected() {
      // 清空所有节点选中状态和hover状态
      let data = this.graph.save()
      data.nodes.forEach(node => {
        node.is_selected = false
        node.is_hover = false
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => {
            child.is_selected = false
            child.is_hover = false
          })
        }
      })
      this.graph.refresh()

      // // 清空当前节点状态
      // this.model.is_selected = false
      // this.model.is_hover = false
      // if (this.model.children && this.model.children.length > 0) {
      //   this.model.children.forEach(child => {
      //     child.is_selected = false
      //     child.is_hover = false
      //   })
      // }
      // const lastNode = this.graph.findById(this.model.id)
      // if (lastNode) lastNode.refresh()
    },
    // 兼容处理 IE 选中状态
    clearNodeSelectBoard() {
      let clearSlct = "getSelection" in window ? function () {

        window.getSelection().removeAllRanges();

      } : function () {

        document.selection.empty();

      };
      clearSlct()
    }
  }
}