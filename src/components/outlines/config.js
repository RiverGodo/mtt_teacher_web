export default {
  normal_node: {
    /**
 * node_characteristic_list 节点类型
 * normal(普通)
 * root(根节点)
 * gather(结合节点)
 */
    node_characteristic_list: ["normal", "root", "gather"],
    placeholder_default: "", // 默认 placeholder
    border_width_default: 2, // 边框宽
    border_radius_default: 5, // 边框圆角
    stroke_color_default: "#474C63", // 默认边框颜色
    fill_color_default: "#fff", // 默认填充颜色
    color_default: "#474C63", // 默认字颜色
    color_placeholder_default: "#ABB7C5", // placeholder 颜色
    font_size_default: 14, // 字体大小
    line_height_default: 16, // 默认行高
    anchors_default: [// 锚点
      [0.5, 0],
      [0.5, 1]
    ]
  },
  ill_node: {
    placeholder_default: "请输入病种名称"
  },
  rect_node: {
    width_default: 100,// 单个矩形节点默认宽
    height_default: 36, // 单个矩形节点默认高
  },
  gather_node: {
    state_default: 1,
    placeholder_default:"集合",
    outer_rect_width_default: 120,//结合节点收起默认宽
    outer_rect_height_default: 56, // 结合节点收起默认高
    child_width_default: 36, // 集合节点子矩形默认宽
    child_height_default: 100, // 集合节点子矩形默认高
    child_spacing: 13, // 集合节点子矩形间隔
    child_padding_tb: 20 // 集合节点子上下padding
  },
  // 展开收起集合节点
  normal_pack: {
    pack_r: 7.5, // 半径
    pack_fill_default: "#4098FF" // 收起节点圆形背景颜色
  },
  // 边
  normal_edge: {
    type: 'cubic',
    stroke_default: "#474C63", // 边默认颜色
    line_width_default: 2, // 边默认宽
  },

  // 标注
  normal_tag: {
    tag_r: 7,
    tag_list: [{
      type: "key_points",
      fill: "#F06363",
      label: "?"
    }],
    tag_list_map: {
      "key_points": {
        fill: "#F06363",
        label: "?"
      },
      "child_key_points": {
        fill: "#F06363",
        label: "?"
      },
      "talk": {
        fill: "#2282DB ",
        label: "依"
      },
      "physical": {
        fill: "#2282DB ",
        label: "依"
      },
      "assist": {
        fill: "#2282DB ",
        label: "依"
      },
      "identify_element": {
        fill: "#0AC7E6 ",
        label: "联"
      },
      "treat": {
        fill: "#9CE260",
        label: "处"
      },
      "PrincipalDiagnosis":{
        fill: "#A876F9",
        label: "主"
      },
      "SecondaryDiagnosis":{
        fill: "#FFA000",
        label: "次"
      },
      "DifferentialDiagnosis":{
        fill: "#0AC7E6 ",
        label: "鉴"
      },
    }
  },
  // 病症难度
  normal_degree: {
    degree_list: [
      { color: "#7ED321", title: "简单" },
      { color: "#4098ff", title: "中等" },
      { color: "#FD6C1E", title: "困难" }
    ]
  },
  // 锚点
  link_points: {
    fill_color_default: "#bae637",
    link_points_r: 8,
    link_points_label: "+",
    link_points_label_color:"#fff",
    font_size_default: 14,
    line_height_default: 16,
  },
  base64: {
    down_arrow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAASCAYAAACEnoQPAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAD6ADAAQAAAABAAAAEgAAAACfRog6AAAB4ElEQVQ4EW1TTWsUQRB91T2zSZDkILiJnhQUif/Av+Av0UtQwbN69qDEq7/DaxAP4tWDqOSgoEtcxIVgPszMdPlez2ycnaSg5tXHq+6q6l1DT9af+biMKI+62ApRtlBSNah+PrJp6wHF3BDeO8AvPO5HBvZT4EkvtFD8ah2X7SWWTwp45vzld4kqpJRr2frReoOb2ePKScQyjmGZEHmIbCHFrIt31Qs3pwuYpBphPsyYpCkZQsmsQGqt9rtQ7BUulc79NO1NswgraQtFZ177+9aWDtq2hIuesDpP1hW8CDBhjhX40y+2jed+NRSck+INxslQZqI+NVW9CSkhorIaUy2R4x0XhWO/rrGZsyQy+b+foIpOCe4YecQ1Hca693mWjW2/xcQNNueczjKSfEa6nAXs7m3ZR52Lu7/xKRoOeNKS8fSMsgeqkWLAofiqyzfLuL7ta4c17jQRIaQ2ngJctlAcvkJaLfB6d8v25Z4Wy7nywm8mx+1GDiVSZQslwfBuct8+t167jrkNJbjRSQgYSb2PjPcL82GnlZ0RarxlO1VKKImlkHNWip/hDgPfH9oRf4Q7bHGkpxHyTXdyfEDO2x7EsPfAvnIbH3jzSJj9IYn+ucXibc7whv+iL8Jz6nLoH0NDpx4eSIuxAAAAAElFTkSuQmCC"
  }
}