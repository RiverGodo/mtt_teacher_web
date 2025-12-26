<template>
  <div class="outline_wrapper">
    <div id="container">
      <!-- 连线后显示的添加节点选择框 -->
      <div
        ref="nodeSelectBoard"
        class="nodeSelectBoard"
        style="position:absolute;z-index:999;left:-1500px;"
      >
        <div class="node_type_wrapper">
          <div class="cancel_add_node" @click="cancelAddNode()">+</div>
          <div
            class="node_type_item"
            draggable="false"
            v-for="(item,index) in node_type_list"
            :key="'node_type_item'+index"
            @click="addNode(item)"
          >
            <img :src="item.img" alt />
            <span>{{item.label}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- tag tip 部分 -->
    <div class="tag_tip_board" ref="tag_tip_board">
      <!-- 要点说明 -->
      <template v-if="current_tag_info.type =='key_points'">
        <div class="title">
          <span
            :style="{background:tag_map[current_tag_info.type].bg}"
          >{{tag_map[current_tag_info.type].tag || ""}}</span>
          <p>{{tag_map[current_tag_info.type].label}}</p>
        </div>
        <div class="tag_tip_info_keypoints_item">
          <div v-for="(item,index) in current_tag_info.data" :key="'current_tag_info'+index">
            <span>{{item.type}}</span>
            <span>{{item.data}}</span>
          </div>
        </div>
      </template>
      <!-- 问诊依据 -->
      <template v-if="current_tag_info.type =='talk'">
        <div class="title">
          <span
            :style="{background:tag_map[current_tag_info.type].bg}"
          >{{tag_map[current_tag_info.type].tag || ""}}</span>
          <p>{{tag_map[current_tag_info.type].label}}（{{current_tag_info.length || 0}}）</p>
        </div>
        <div
          class="tag_tip_info_talk_item"
          v-for="(item,index) in current_tag_info.data"
          :key="'current_tag_info'+index"
        >
          <div class="talk_item">
            <span>问：</span>
            <span>{{item.question}}</span>
          </div>
          <div class="talk_item">
            <span>答：</span>
            <span>{{item.answer}}</span>
          </div>
        </div>
      </template>
      <!-- 查体依据 -->
      <template v-if="current_tag_info.type =='physical'">
        <div class="title">
          <span
            :style="{background:tag_map[current_tag_info.type].bg}"
          >{{tag_map[current_tag_info.type].tag || ""}}</span>
          <p>{{tag_map[current_tag_info.type].label}}（{{current_tag_info.length || 0}}）</p>
        </div>
        <div class="tag_tip_info_physical_item">
          <div
            v-for="(item,index) in current_tag_info.data"
            :key="'current_tag_info_item'+index"
          >[{{item.frequency_index}}诊]{{item.item_name}}</div>
        </div>
      </template>
      <!-- 辅助检查依据 -->
      <template v-if="current_tag_info.type =='assist'">
        <div class="title">
          <span
            :style="{background:tag_map[current_tag_info.type].bg}"
          >{{tag_map[current_tag_info.type].tag || ""}}</span>
          <p>{{tag_map[current_tag_info.type].label}}（{{current_tag_info.length || 0}}）</p>
        </div>
        <div class="tag_tip_info_assist_item">
          <div
            v-for="(item,index) in current_tag_info.data"
            :key="'current_tag_info_item'+index"
          >[{{item.frequency_index}}诊]{{item.item_name}}</div>
        </div>
      </template>
      <!-- 关联鉴别要素 -->
      <template v-if="current_tag_info.type =='identify_element'">
        <div class="title">
          <span
            :style="{background:tag_map[current_tag_info.type].bg}"
          >{{tag_map[current_tag_info.type].tag || ""}}</span>
          <p>{{tag_map[current_tag_info.type].label}}</p>
        </div>
        <div
          v-for="(value,key,index) in current_tag_info.data"
          :key="'tag_tip_info_identify_element_item'+index"
        >
          <div class="tag_tip_info_identify_element_item" v-if="Object.keys(value).length > 0">
            <!-- 问诊 -->
            <template v-if="key == 'talk' && value">
              <div
                v-for="(child_value,child_key,child_index) in value"
                :key="'child_value'+child_index"
              >
                <div class="item_title">
                  <span
                    class="item_title_tag"
                    :style="{background:tag_map[key].title_tag_bg}"
                  >{{tag_map[key].short_label}}</span>
                  <span>{{child_key}}</span>
                </div>
                <div
                  class="q_and_a"
                  v-for="(child_value_item,child_value_item_index) in child_value"
                  :key="'child_value_item'+child_value_item_index"
                >
                  <div class="q_item">
                    <span>问：</span>
                    <span>{{child_value_item.question}}</span>
                  </div>
                  <div class="a_item">
                    <span>答：</span>
                    <span>{{child_value_item.answer}}</span>
                  </div>
                </div>
              </div>
            </template>
            <!-- 查体 -->
            <template v-if="key == 'physical'">
              <div
                v-for="(child_value,child_key,child_index) in value"
                :key="'child_value'+child_index"
              >
                <div class="item_title">
                  <span
                    class="item_title_tag"
                    :style="{background:tag_map[key].title_tag_bg}"
                  >{{tag_map[key].short_label}}</span>
                  <span>{{child_key}}</span>
                </div>
                <div class="physical_item">
                  <div
                    v-for="(physical_item,physical_item_index) in child_value"
                    :key="'physical_item'+physical_item_index"
                  >[{{physical_item.frequency_index | translateToHans}}诊] &nbsp;{{physical_item.item_name}}</div>
                </div>
              </div>
            </template>
            <!-- 辅助检查 -->
            <template v-if="key == 'assist' && value">
              <div
                v-for="(child_value,child_key,child_index) in value"
                :key="'child_value'+child_index"
              >
                <div class="item_title">
                  <span
                    class="item_title_tag"
                    :style="{background:tag_map[key].title_tag_bg}"
                  >{{tag_map[key].short_label}}</span>
                  <span>{{child_key}}</span>
                </div>
                <div class="physical_item">
                  <div
                    v-for="(assist_item,assist_item_index) in child_value"
                    :key="'assist_item'+assist_item_index"
                  >[{{assist_item.frequency_index | translateToHans}}诊] &nbsp;{{assist_item.item_name}}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
      <!-- 治疗要素 -->
      <template v-if="current_tag_info.type =='treat'">
        <div class="title">
          <span
            :style="{background:tag_map[current_tag_info.type].bg}"
          >{{tag_map[current_tag_info.type].tag || ""}}</span>
          <p>{{tag_map[current_tag_info.type].label}}</p>
        </div>
        <div
          v-for="(value,key,index) in current_tag_info.data"
          :key="'tag_tip_info_identify_element_item'+index"
        >
          <div class="tag_tip_info_identify_element_item" v-if="Object.keys(value).length > 0">
            <div>
              <span class="treat_item_tag">{{key|translateSupport}}</span>
            </div>
            <div
              v-for="(item,index) in value"
              :key="'item'+index"
            >[{{item.frequency_index}}诊] {{item.item_name}}</div>
          </div>
        </div>
      </template>
      <!-- 病种 -->
      <template v-if="current_tag_info.type =='illness'">
        <div v-for="(value,key,index) in current_tag_info.data" :key="'value'+index">
          <template
            v-if="value.assist.length > 0 || value.physical.length > 0 || value.talk.length > 0"
          >
            <div class="title">{{key|translateSupport}}</div>
            <div
              v-for="(child_value,child_key,child_index) in value"
              :key="'child_value'+child_index"
            >
              <div>
                <div
                  class="tag_tip_info_identify_element_item"
                  v-if="child_key == 'talk' && child_value.length > 0"
                >
                  <span class="treat_item_tag">{{tag_map[child_key].short_label}}</span>
                  <div
                    v-for="(item,item_index) in child_value"
                    :key="'item'+item_index"
                  >[{{item.frequency_index}}诊] {{item.question}}</div>
                </div>
                <div
                  class="tag_tip_info_identify_element_item"
                  v-if="child_key == 'physical' && child_value.length > 0"
                >
                  <span class="treat_item_tag">{{tag_map[child_key].short_label}}</span>
                  <div
                    v-for="(item,item_index) in child_value"
                    :key="'item'+item_index"
                  >[{{item.frequency_index}}诊] {{item.item_name}}</div>
                </div>
                <div
                  class="tag_tip_info_identify_element_item"
                  v-if="child_key == 'assist' && child_value.length > 0"
                >
                  <span class="treat_item_tag">{{tag_map[child_key].short_label}}</span>
                  <div
                    v-for="(item,item_index) in child_value"
                    :key="'item'+item_index"
                  >[{{item.frequency_index}}诊] {{item.item_name}}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- 查看提纲节点信息部分 -->
    <div v-if="outlinesee && is_show_node_info" class="node_info_board">
      <div class="node_title">
        {{current_node_info.title}}
        <img
          class="close"
          src="../../assets/img/error.png"
          @click="is_show_node_info=false"
        />
      </div>
      <div class="node_main" ref="nodeMainBoard">
        <div class="legend" v-if="current_node_info.type !== 'treat'">
          <div
            class="legend_item"
            v-for="(item,index) in legend_list"
            :key="'legend_list_item'+index"
          >
            <span :style="{background:item.bg}"></span>
            <div>{{item.label}}</div>
          </div>
        </div>
        <!-- 要点说明 -->
        <div
          class="node_key_points"
          v-if="current_node_info.key_points.label || current_node_info.key_points.files.length > 0"
        >
          <div class="title">要点说明：</div>
          <div>{{current_node_info.key_points.label}}</div>
          <div class="node_key_points_file_wrapper">
            <div
              class="file_item"
              v-for="(item,index) in current_node_info.key_points.files"
              :key="'childmodelfile'+index"
              @click="showNodeKeyPointFile(item)"
            >
              <img
                class="cover_tag_png"
                v-if="item.type=='img'"
                src="../../assets/img/graph_file_image.png"
                alt
              />
              <img
                class="cover_tag_png"
                v-if="item.type=='video'"
                src="../../assets/img/graph_file_video.png"
                alt
              />
              <img
                class="cover_tag_png"
                v-if="item.type=='audio'"
                src="../../assets/img/graph_file_audio.png"
                alt
              />
              <img class="pic" :src="item.url" alt />
              <div class="mask"></div>
            </div>
          </div>
        </div>
        <!-- 诊疗tab -->
        <div class="diagnosis_tab">
          <div
            :class="['diagnosis_tab_item',current_node_info.diagnosis_key == key ? 'diagnosis_tab_item_active' : '']"
            v-for="(value,key,index) of current_node_info.data"
            :key="'current_node_info'+index"
            @click="changeDiagnosisTab(key)"
          >{{key|translateToHans}}诊</div>
        </div>
        <!-- 问诊依据 -->
        <div v-if="current_node_info.type == 'talk'">
          <div
            class="node_info_type"
            v-if="current_node_info.data[current_node_info.diagnosis_key].length > 0"
          >
            <div
              class="title"
            >问诊依据（{{current_node_info.data[current_node_info.diagnosis_key].length}}项）</div>
            <div
              class="node_info_type_item"
              v-for="(node_info_type_item,node_info_type_item_index) in current_node_info.data[current_node_info.diagnosis_key]"
              :key="'node_info_type_item'+node_info_type_item_index"
            >
              <div class="q_and_a">
                <span>问：</span>
                <span>{{node_info_type_item.question}}</span>
              </div>
              <div class="q_and_a">
                <span>答：</span>
                <span>{{node_info_type_item.answer}}</span>
              </div>
              <div
                class="support_item_line"
                v-if="node_info_type_item.SupportingBasis.PrincipalDiagnosis.length > 0 
                || node_info_type_item.SupportingBasis.SecondaryDiagnosis.length > 0 
                || node_info_type_item.SupportingBasis.DifferentialDiagnosis.length > 0"
              >
                <span class="support_item_line_title">[支持]</span>
                <div class="support_item_all">
                  <!-- 主 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.PrincipalDiagnosis"
                    :key="'support_item_s_p'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.PrincipalDiagnosis.color,borderColor:legend_list_map.PrincipalDiagnosis.color}"
                  >{{support_item}}</span>
                  <!-- 次 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.SecondaryDiagnosis"
                    :key="'support_item_s_s'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.SecondaryDiagnosis.color,borderColor:legend_list_map.SecondaryDiagnosis.color}"
                  >{{support_item}}</span>
                  <!-- 鉴别 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.DifferentialDiagnosis"
                    :key="'support_item_s_d'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.DifferentialDiagnosis.color,borderColor:legend_list_map.DifferentialDiagnosis.color}"
                  >{{support_item}}</span>
                </div>
              </div>
              <!-- v-if="node_info_type_item.NonSupportingBasis.PrincipalDiagnosis.length > 0 
                || node_info_type_item.NonSupportingBasis.SecondaryDiagnosis.length > 0 
              || node_info_type_item.NonSupportingBasis.DifferentialDiagnosis.length > 0"-->
              <div
                class="support_item_line"
                v-if="node_info_type_item.NonSupportingBasis.DifferentialDiagnosis.length > 0"
              >
                <!-- 排除部分只有鉴别 DifferentialDiagnosis-->
                <span class="support_item_line_title">[排除]</span>
                <div class="support_item_all">
                  <!-- 主 -->
                  <!-- <span
                    v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.PrincipalDiagnosis"
                    :key="'support_item_u_p'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.PrincipalDiagnosis.color,borderColor:legend_list_map.PrincipalDiagnosis.color}"
                  >{{support_item}}</span>-->
                  <!-- 次 -->
                  <!-- <span
                    v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.SecondaryDiagnosis"
                    :key="'support_item_u_s'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.SecondaryDiagnosis.color,borderColor:legend_list_map.SecondaryDiagnosis.color}"
                  >{{support_item}}</span>-->
                  <!-- 鉴别 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.DifferentialDiagnosis"
                    :key="'support_item_u_d'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.DifferentialDiagnosis.color,borderColor:legend_list_map.DifferentialDiagnosis.color}"
                  >{{support_item}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 辅检依据 -->
        <div v-if="current_node_info.type == 'assist'">
          <div
            class="node_info_type"
            v-if="current_node_info.data[current_node_info.diagnosis_key].length > 0"
          >
            <div
              class="title"
            >辅助检查依据 ({{current_node_info.data[current_node_info.diagnosis_key].length}}项）</div>
            <div
              class="node_info_type_item"
              v-for="(node_info_type_item,node_info_type_item_index) in current_node_info.data[current_node_info.diagnosis_key]"
              :key="'node_info_type_item'+node_info_type_item_index"
            >
              <div class="node_info_type_item_title">
                {{node_info_type_item.item_name}}: {{node_info_type_item.result_text}}
                <span
                  v-if="node_info_type_item.type != 'None' && node_info_type_item.attachment.length > 0"
                  @click="showNodeElementFile(node_info_type_item.type,node_info_type_item.attachment)"
                  style="color: #1790FF;text-decoration: underline;cursor:pointer"
                >查看结果</span>
                <!-- <div v-else>检查结果：{{node_info_type_item.result_text}}</div> -->
              </div>
              <div class="support_item_line">
                <span class="support_item_line_title">[支持]</span>
                <div class="support_item_all">
                  <!-- 主 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.PrincipalDiagnosis"
                    :key="'support_item_s_p'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.PrincipalDiagnosis.color,borderColor:legend_list_map.PrincipalDiagnosis.color}"
                  >{{support_item}}</span>
                  <!-- 次 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.SecondaryDiagnosis"
                    :key="'support_item_s_s'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.SecondaryDiagnosis.color,borderColor:legend_list_map.SecondaryDiagnosis.color}"
                  >{{support_item}}</span>
                  <!-- 鉴别 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.DifferentialDiagnosis"
                    :key="'support_item_s_d'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.DifferentialDiagnosis.color,borderColor:legend_list_map.DifferentialDiagnosis.color}"
                  >{{support_item}}</span>
                </div>
              </div>
              <div
                class="support_item_line"
                v-if="node_info_type_item.NonSupportingBasis.DifferentialDiagnosis.length > 0"
              >
                <span class="support_item_line_title">[排除]</span>
                <div class="support_item_all">
                  <!-- 主 -->
                  <!-- <span
                    v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.PrincipalDiagnosis"
                    :key="'support_item_u_p'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.PrincipalDiagnosis.color,borderColor:legend_list_map.PrincipalDiagnosis.color}"
                  >{{support_item}}</span>-->
                  <!-- 次 -->
                  <!-- <span
                    v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.SecondaryDiagnosis"
                    :key="'support_item_u_s'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.SecondaryDiagnosis.color,borderColor:legend_list_map.SecondaryDiagnosis.color}"
                  >{{support_item}}</span>-->
                  <!-- 鉴别 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.DifferentialDiagnosis"
                    :key="'support_item_u_d'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.DifferentialDiagnosis.color,borderColor:legend_list_map.DifferentialDiagnosis.color}"
                  >{{support_item}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 体检依据 -->
        <div v-if="current_node_info.type == 'physical'">
          <div
            class="node_info_type"
            v-if="current_node_info.data[current_node_info.diagnosis_key].length"
          >
            <div
              class="title"
            >体格检查依据 ({{current_node_info.data[current_node_info.diagnosis_key].length}}项）</div>

            <div
              class="node_info_type_item"
              v-for="(node_info_type_item,node_info_type_item_index) in current_node_info.data[current_node_info.diagnosis_key]"
              :key="'node_info_type_item'+node_info_type_item_index"
            >
              <div class="node_info_type_item_title">
                {{node_info_type_item.item_name}}:: {{node_info_type_item.result_text}}
                <span
                  v-if="node_info_type_item.result_media_type != 'None' && node_info_type_item.attachment.length > 0"
                  style="color: #1790FF;text-decoration: underline;cursor:pointer"
                  @click="showNodeElementFile(node_info_type_item.result_media_type,node_info_type_item.attachment)"
                >查看结果</span>
                <!-- <span v-else>检查结果：{{node_info_type_item.result_text}}</span> -->
                <!-- <div v-else>检查结果：{{node_info_type_item.result_text}}</div> -->
              </div>
              <div
                class="support_item_line"
                v-if="node_info_type_item.SupportingBasis.PrincipalDiagnosis.length > 0 
                ||node_info_type_item.SupportingBasis.SecondaryDiagnosis.length > 0
                ||node_info_type_item.SupportingBasis.DifferentialDiagnosis.length > 0
                "
              >
                <span class="support_item_line_title">[支持]</span>
                <div class="support_item_all">
                  <!-- 主 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.PrincipalDiagnosis"
                    :key="'support_item_s_p'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.PrincipalDiagnosis.color,borderColor:legend_list_map.PrincipalDiagnosis.color}"
                  >{{support_item}}</span>
                  <!-- 次 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.SecondaryDiagnosis"
                    :key="'support_item_s_s'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.SecondaryDiagnosis.color,borderColor:legend_list_map.SecondaryDiagnosis.color}"
                  >{{support_item}}</span>
                  <!-- 鉴别 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.DifferentialDiagnosis"
                    :key="'support_item_s_d'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.DifferentialDiagnosis.color,borderColor:legend_list_map.DifferentialDiagnosis.color}"
                  >{{support_item}}</span>
                </div>
              </div>
              <div
                class="support_item_line"
                v-if="node_info_type_item.NonSupportingBasis.DifferentialDiagnosis.length > 0"
              >
                <span class="support_item_line_title">[排除]</span>
                <div class="support_item_all">
                  <!-- 主 -->
                  <!-- <span
                    v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.PrincipalDiagnosis"
                    :key="'support_item_u_p'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.PrincipalDiagnosis.color,borderColor:legend_list_map.PrincipalDiagnosis.color}"
                  >{{support_item}}</span>-->
                  <!-- 次 -->
                  <!-- <span
                    v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.SecondaryDiagnosis"
                    :key="'support_item_u_s'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.SecondaryDiagnosis.color,borderColor:legend_list_map.SecondaryDiagnosis.color}"
                  >{{support_item}}</span>-->
                  <!-- 鉴别 -->
                  <span
                    v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.DifferentialDiagnosis"
                    :key="'support_item_u_d'+support_item_index"
                    class="support_item_line_illness"
                    :style="{color:legend_list_map.DifferentialDiagnosis.color,borderColor:legend_list_map.DifferentialDiagnosis.color}"
                  >{{support_item}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 鉴别要素 -->
        <div v-if="current_node_info.type == 'identify_element'">
          <div class="node_info_type">
            <div
              class="identify_element_per_node_info"
              v-for="(per_node_info_value,per_node_info_key,per_node_info_index) in current_node_info.data[current_node_info.diagnosis_key]"
              :key="'per_node_info_value' + per_node_info_index"
            >
              <div
                class="identify_element_per_node_info_first_level"
                style="margin-top:5px"
                v-if="JSON.stringify(per_node_info_value)!='{}'"
                @click.stop="handleCollapse(per_node_info_key)"
              >
                {{tag_map[per_node_info_key].label}}
                <img
                  :src="collapse_arr.indexOf(per_node_info_key) == -1 ?arrow_up_white:arrow_down_white"
                />
              </div>
              <template v-if="collapse_arr.indexOf(per_node_info_key) == -1">
                <div
                  class="identify_element_per_node_info_second_level"
                  v-for="(value,key,index) in per_node_info_value"
                  :key="'item'+index"
                >
                  <div style="width:100%;height:1px;background:#EEEEEE;"></div>
                  <div class="title" @click.stop="handleCollapse(per_node_info_key+key)">
                    {{key}} ({{value.length}}项)
                    <img
                      :src="collapse_arr.indexOf(per_node_info_key+key) == -1 ?arrow_up_gray:arrow_down_gray"
                    />
                  </div>
                  <template v-if="collapse_arr.indexOf(per_node_info_key+key) == -1">
                    <div
                      class="node_info_type_item"
                      v-for="(node_info_type_item,node_info_type_item_index) in value"
                      :key="'node_info_type_item'+node_info_type_item_index"
                    >
                      <!-- 问诊依据 -->
                      <div v-if="per_node_info_key =='talk'">
                        <div class="q_and_a">
                          <span>问：</span>
                          <span>{{node_info_type_item.question}}</span>
                        </div>
                        <div class="q_and_a">
                          <span>答：</span>
                          <span>{{node_info_type_item.answer}}</span>
                        </div>
                      </div>
                      <!-- 查体依据 -->
                      <div v-if="per_node_info_key =='physical'">
                        <div class="node_info_type_item_title">
                          {{node_info_type_item.item_name}}: {{node_info_type_item.result_text}}
                          <span
                            v-if="node_info_type_item.result_media_type != 'None' && node_info_type_item.attachment.length > 0"
                            style="color: #1790FF;text-decoration: underline;cursor:pointer"
                            @click="showNodeElementFile(node_info_type_item.result_media_type,node_info_type_item.attachment)"
                          >查看结果</span>
                          <!-- <span v-else>检查结果：{{node_info_type_item.result_text}}</span> -->
                          <!-- <div v-else>检查结果：{{node_info_type_item.result_text}}</div> -->
                        </div>
                      </div>
                      <!-- 辅助检查依据 -->
                      <div v-if="per_node_info_key =='assist'">
                        <div class="node_info_type_item_title">
                          {{node_info_type_item.item_name}}: {{node_info_type_item.result_text}}
                          <span
                            v-if="node_info_type_item.type != 'None' && node_info_type_item.attachment.length > 0"
                            style="color: #1790FF;text-decoration: underline;cursor:pointer"
                            @click="showNodeElementFile(node_info_type_item.type,node_info_type_item.attachment)"
                          >查看结果</span>
                          <!-- <span v-else>检查结果：{{node_info_type_item.result_text}}</span> -->
                          <!-- <div v-else>检查结果：{{node_info_type_item.result_text}}</div> -->
                        </div>
                      </div>
                      <div
                        class="support_item_line"
                        v-if="node_info_type_item.SupportingBasis.PrincipalDiagnosis.length > 0
                      || node_info_type_item.SupportingBasis.SecondaryDiagnosis.length > 0
                      || node_info_type_item.SupportingBasis.DifferentialDiagnosis.length > 0"
                      >
                        <span class="support_item_line_title">[支持]</span>
                        <div class="support_item_all">
                          <!-- 主 -->
                          <span
                            v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.PrincipalDiagnosis"
                            :key="'support_item_s_p'+support_item_index"
                            class="support_item_line_illness"
                            :style="{color:legend_list_map.PrincipalDiagnosis.color,borderColor:legend_list_map.PrincipalDiagnosis.color}"
                          >{{support_item}}</span>
                          <!-- 次 -->
                          <span
                            v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.SecondaryDiagnosis"
                            :key="'support_item_s_s'+support_item_index"
                            class="support_item_line_illness"
                            :style="{color:legend_list_map.SecondaryDiagnosis.color,borderColor:legend_list_map.SecondaryDiagnosis.color}"
                          >{{support_item}}</span>
                          <!-- 鉴别 -->
                          <span
                            v-for="(support_item,support_item_index) in node_info_type_item.SupportingBasis.DifferentialDiagnosis"
                            :key="'support_item_s_d'+support_item_index"
                            class="support_item_line_illness"
                            :style="{color:legend_list_map.DifferentialDiagnosis.color,borderColor:legend_list_map.DifferentialDiagnosis.color}"
                          >{{support_item}}</span>
                        </div>
                      </div>
                      <div
                        class="support_item_line"
                        v-if="node_info_type_item.NonSupportingBasis.DifferentialDiagnosis.length > 0"
                      >
                        <span class="support_item_line_title">[排除]</span>
                        <div class="support_item_all">
                          <!-- 主 -->
                          <!-- <span
                            v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.PrincipalDiagnosis"
                            :key="'support_item_u_p'+support_item_index"
                            class="support_item_line_illness"
                            :style="{color:legend_list_map.PrincipalDiagnosis.color,borderColor:legend_list_map.PrincipalDiagnosis.color}"
                          >{{support_item}}</span>-->
                          <!-- 次 -->
                          <!-- <span
                            v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.SecondaryDiagnosis"
                            :key="'support_item_u_s'+support_item_index"
                            class="support_item_line_illness"
                            :style="{color:legend_list_map.SecondaryDiagnosis.color,borderColor:legend_list_map.SecondaryDiagnosis.color}"
                          >{{support_item}}</span>-->
                          <!-- 鉴别 -->
                          <span
                            v-for="(support_item,support_item_index) in node_info_type_item.NonSupportingBasis.DifferentialDiagnosis"
                            :key="'support_item_u_d'+support_item_index"
                            class="support_item_line_illness"
                            :style="{color:legend_list_map.DifferentialDiagnosis.color,borderColor:legend_list_map.DifferentialDiagnosis.color}"
                          >{{support_item}}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
        <!-- 治疗要素 -->
        <div v-if="current_node_info.type == 'treat'">
          <div class="node_info_type">
            <div
              class="identify_element_per_node_info"
              v-for="(per_node_info_value,per_node_info_key,per_node_info_index) in current_node_info.data[current_node_info.diagnosis_key]"
              :key="'per_node_info_value' + per_node_info_index"
            >
              <!-- 药品 -->
              <div
                v-if="per_node_info_key=='medicine' 
                && JSON.stringify(per_node_info_value)!='{}' 
                && (per_node_info_value.chinese_medicine.length > 0 ||per_node_info_value.western_medicine.length > 0)"
              >
                <div
                  class="identify_element_per_node_info_first_level"
                  style="margin-top:5px"
                >{{per_node_info_key | translateSupport}}</div>
                <div v-for="(value,key,index) in per_node_info_value" :key="'value'+index">
                  <template v-if="value.length > 0">
                    <div class="title">{{key|translateSupport}}</div>
                    <div
                      class="node_info_type_item"
                      v-for="(node_info_type_item,node_info_type_item_index) in value"
                      :key="'node_info_type_item'+node_info_type_item_index"
                    >
                      <div class="node_info_type_item_treat">
                        <span>{{key|translateSupport}}名称：</span>
                        <span>{{node_info_type_item.medicine_name}}</span>
                      </div>
                      <div class="node_info_type_item_treat">
                        <span>药物用法：</span>
                        <span>{{node_info_type_item.usage}}</span>
                      </div>
                      <div class="node_info_type_item_treat">
                        <span>药物剂量：</span>
                        <span>{{node_info_type_item.dosage}}</span>
                      </div>
                      <div class="node_info_type_item_treat">
                        <span>时间间隔：</span>
                        <span>{{node_info_type_item.medicine_name}}</span>
                      </div>
                      <div class="node_info_type_item_treat">
                        <span>应用理由：</span>
                        <span>{{node_info_type_item.reason_for_using}}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <!-- 护理 -->
              <div v-if="per_node_info_key=='nurse' && JSON.stringify(per_node_info_value)!='{}'">
                <!-- {{per_node_info_value}} -->
                <div
                  class="identify_element_per_node_info_first_level"
                  style="margin-top:5px"
                >{{per_node_info_key | translateSupport}}</div>
                <div class="node_info_type_item">
                  <div class="node_info_type_item_treat" v-if="per_node_info_value.nursing_level">
                    <span>护理等级：</span>
                    <span>{{per_node_info_value.nursing_level.nursing_level}}</span>
                  </div>
                  <div class="node_info_type_item_treat" v-if="per_node_info_value.diet && per_node_info_value.diet.length > 0">
                    <span>膳食：</span>
                    <span
                      v-for="(item,index) in per_node_info_value.diet"
                      :key="'item'+index"
                    >{{item.diet}} &nbsp;</span>
                  </div>
                  <div class="node_info_type_item_treat" v-if="per_node_info_value.position && per_node_info_value.position.position">
                    <span>体位：</span>
                    <span>{{per_node_info_value.position.position}}</span>
                  </div>
                  <!-- <div class="node_info_type_item_treat">
                      <span>护理项目：</span>
                      <span>{{per_node_info_value.nursing_level.nursing_level}}</span>
                    </div>
                    <div class="node_info_type_item_treat">
                      <span>应用理由：</span>
                      <span>{{per_node_info_value.nursing_level.nursing_level}}</span>
                  </div>-->
                </div>
              </div>
              <!-- 手术 -->
              <div v-if="per_node_info_key=='operation' && per_node_info_value.length > 0">
                <div
                  class="identify_element_per_node_info_first_level"
                  style="margin-top:5px"
                >{{per_node_info_key | translateSupport}}</div>
                <div
                  class="node_info_type_item"
                  v-for="(item,index) in per_node_info_value"
                  :key="'item'+index"
                >
                  <div class="node_info_type_item_treat" v-if="item.operation">
                    <span>手术名称：</span>
                    <span>{{item.operation}}</span>
                  </div>
                  <div class="node_info_type_item_treat" v-if="item.reason_for_using" >
                    <span>应用理由：</span>
                    <span>{{item.reason_for_using}}</span>
                  </div>
                </div>
              </div>
              <!-- 其他 -->
              <div v-if="per_node_info_key=='other' && per_node_info_value.length > 0">
                <div
                  class="identify_element_per_node_info_first_level"
                  style="margin-top:5px"
                >{{per_node_info_key | translateSupport}}</div>
                <div
                  class="node_info_type_item"
                  v-for="(item,index) in per_node_info_value"
                  :key="'item'+index"
                >
                  <div class="node_info_type_item_treat" v-if="item.other_name">
                    <span>名称：</span>
                    <span>{{item.other_name}}</span>
                  </div>
                  <div class="node_info_type_item_treat" v-if="item.reason_for_using">
                    <span>应用理由：</span>
                    <span>{{item.reason_for_using}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 病种 illness -->
        <div v-if="current_node_info.type == 'illness'">
          <div class="node_info_type">
            <div
              class="identify_element_per_node_info"
              v-for="(per_node_info_value,per_node_info_key,per_node_info_index) in current_node_info.data[current_node_info.diagnosis_key]"
              :key="'per_node_info_value' + per_node_info_index"
            >
              <div
                class="identify_element_per_node_info_first_level"
                style="margin-top:5px"
                v-if="JSON.stringify(per_node_info_value)!='{}' 
                && (JSON.stringify(per_node_info_value.assist)!='{}'
                || JSON.stringify(per_node_info_value.physical)!='{}'
                || JSON.stringify(per_node_info_value.talk)!='{}')
                "
                @click.stop="handleCollapse(per_node_info_key)"
              >
                {{per_node_info_key | translateSupport}}
                <img
                  :src="collapse_arr.indexOf(per_node_info_key) == -1 ?arrow_up_white:arrow_down_white"
                />
              </div>
              <template v-if="collapse_arr.indexOf(per_node_info_key) == -1 ">
                <div
                  class="identify_element_per_node_info_second_level"
                  v-for="(value,key,index) in per_node_info_value"
                  :key="'item'+index"
                  @click.stop="handleCollapse(per_node_info_key+key)"
                >
                  <template v-if="JSON.stringify(value) !== '{}'">
                    <div style="width:100%;height:1px;background:#EEEEEE;"></div>
                    <div class="title" :style="{background:'#eee'}">
                      {{tag_map[key].label}}
                      <img
                        :src="collapse_arr.indexOf(per_node_info_key+key) == -1 ?arrow_up_gray:arrow_down_gray"
                      />
                    </div>
                    <template v-if="collapse_arr.indexOf(per_node_info_key+key) == -1 ">
                      <div
                        class="node_info_type_item"
                        v-for="(node_info_type_value,node_info_type_item_key,node_info_type_item_index) in value"
                        :key="'node_info_type_item'+node_info_type_item_index"
                      >
                        <!-- {{node_info_type_value}} -->
                        <!-- 问诊 -->

                        <template v-if="node_info_type_value.length > 0">
                          <div
                            class="title"
                            style="margin-top:0px"
                            @click.stop="handleCollapse(per_node_info_key+key+node_info_type_item_key)"
                          >
                            {{node_info_type_item_key}}
                            <img
                              :src="collapse_arr.indexOf(per_node_info_key+key+node_info_type_item_key) == -1 ?arrow_up_gray:arrow_down_gray"
                            />
                          </div>
                          <template
                            v-if="collapse_arr.indexOf(per_node_info_key+key+node_info_type_item_key) == -1 "
                          >
                            <div v-for="(item,index) in node_info_type_value" :key="'item'+index">
                              <div v-if="key=='talk'" class="node_info_type_item" @click.stop=";">
                                <div class="q_and_a">
                                  <span>问：</span>
                                  <span>{{item.question}}</span>
                                </div>
                                <div class="q_and_a">
                                  <span>答：</span>
                                  <span>{{item.answer}}</span>
                                </div>
                              </div>
                              <!-- 查体依据 -->
                              <div v-if="key =='physical'" class="node_info_type_item" @click.stop=";">
                                <div class="node_info_type_item_title"> 
                                  {{item.item_name}}: {{item.result_text}}
                                  <span
                                    v-if="item.result_media_type != 'None' && item.attachment.length > 0"
                                    @click="showNodeElementFile(item.result_media_type,item.attachment)"
                                    style="color: #1790FF;text-decoration: underline;cursor:pointer"
                                  >查看结果</span>
                                  <!-- <span v-else>检查结果：{{item.result_text}}</span> -->
                                  <!-- <div v-else>检查结果：{{item.result_text}}</div> -->
                                </div>
                              </div>
                              <!-- 辅助检查依据 -->
                              <div v-if="key =='assist'" class="node_info_type_item" @click.stop=";">
                                <div class="node_info_type_item_title">
                                  {{item.item_name}}: {{item.result_text}}
                                  <span
                                    v-if="item.result_media_type != 'None' && item.attachment.length > 0"
                                    @click="showNodeElementFile(item.result_media_type,item.attachment)"
                                    style="color: #1790FF;text-decoration: underline;cursor:pointer"
                                  >查看结果</span>
                                  <!-- <span v-else>检查结果：{{item.result_text}}</span> -->
                                  <!-- <div v-else>检查结果：{{item.result_text}}</div> -->
                                </div>
                              </div>
                            </div>
                          </template>
                        </template>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <Spin fix v-if="show_node_info_loading">
        <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
    </div>

    <!-- 右侧编辑面板 部分 -->
    <!-- 编辑节点部分 -->
    <div
      class="options_board"
      :style="{'overflowY':uploadConfig.process!=0 ? 'hidden' : 'scroll'}"
      v-if="is_edit && canedit"
    >
      <div class="options_title">编辑模块</div>

      <template v-if="model.current_edit == 'outer'">
        <!-- <div class="options_item">
          <p>添加模块：</p>
          <div class="node_type_wrapper">
            <div
              class="node_type_item"
              v-for="(item,index) in node_type_list"
              :key="'node_type_item'+index"
              @click="addNode(item)"
            >
              <img :src="item.img" alt />
              <span>{{item.label}}</span>
            </div>
          </div>
        </div>-->
        <template v-if="model.node_type == 'root'">
          <!-- <div class="options_item">
            <p>症状名称：</p>
          </div>-->
          <div class="options_item">
            <p>症状难度：</p>
            <div style="margin-top:15px">
              <RadioGroup v-model="model.degree" @on-change="changeDegree">
                <Radio label="1">
                  <span>简单</span>
                </Radio>
                <Radio label="2">
                  <span>适中</span>
                </Radio>
                <Radio label="3">
                  <span>困难</span>
                </Radio>
              </RadioGroup>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="options_item">
            <p>要点内容：</p>
            <div class="node_type_item">
              <textarea
                type="text"
                v-model="model.label"
                placeholder="请输入内容"
                @input="updateNode('parent','label',model.label)"
              />
            </div>
          </div>
        </template>

        <template v-if="model.node_type != 'root'">
          <div class="options_item">
            <p>标记模块：</p>
            <div class="mark_wrapper">
              <!-- :class="['mark_list_item',
              model.mark_id == index+1 ?
              'mark_list_item_active' :'']"-->
              <div
                class="mark_list_item"
                :style="{
                  'background':model.mark_id == index+1 ? item.color:'',
                  'borderColor':model.mark_id == index+1 ? item.color:'#dce0e4',
                  'textAlign':model.mark_id == index+1 ? 'center':'left',
                  'color':model.mark_id == index+1 ? '#fff':'#01070D',
                  }"
                v-for="(item,index) in mark_list"
                :key="'mark_list_item'+index"
                @click="changeNodeMark(item)"
              >
                <span :style="{background:item.color}" v-if="model.mark_id != index+1"></span>
                {{item.label}}
              </div>
            </div>
          </div>
          <!-- v-if="model.node_type != 'gather'" -->
          <div class="options_item">
            <Spin fix v-if="uploadConfig.process!=0">
              <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
              <div>Loading {{uploadConfig.process}} %</div>
            </Spin>
            <p>要点说明：</p>
            <textarea
              v-model="model.tags[0].label"
              cols="30"
              rows="10"
              placeholder="请输入内容"
              @input="updateNode('parent','label',model.tags[0].label)"
            ></textarea>
            <p>附件支持上传音频/视频/图片：</p>
            <div class="file_wrapper">
              <div
                class="file_item"
                v-for="(item,index) in model.tags[0].files"
                :key="'modelfile'+index"
                @click="showNodeKeyPointFile(item)"
              >
                <img
                  class="cover_tag_png"
                  v-if="item.type=='img'"
                  src="../../assets/img/graph_file_image.png"
                  alt
                />
                <img
                  class="cover_tag_png"
                  v-if="item.type=='video'"
                  src="../../assets/img/graph_file_video.png"
                  alt
                />
                <img
                  class="cover_tag_png"
                  v-if="item.type=='audio'"
                  src="../../assets/img/graph_file_audio.png"
                  alt
                />
                <img
                  class="delete_png"
                  src="../../assets/img/graph_file_delete.png"
                  alt
                  @click.prevent="deleteKeyPointFile($event,model.tags[0].files,index)"
                />
                <img class="pic" :src="item.url" alt />
                <div class="mask"></div>
              </div>
              <div
                class="file_item"
                style="background: #F8F9FB;border: 1px solid #DCE0E4; "
                @click="uploadFile"
              >
                <img class="add_png" src="../../assets/img/graph_file_add.png" alt />
                <!-- <Circle v-if="uploadConfig.process!=0" :percent="uploadConfig.process" style="width:100%;position:absolute;left:0;top:0"> -->
                <!-- <span class="demo-Circle-inner" style="font-size:24px">{{uploadConfig.process}}%</span> -->
                <!-- </Circle> -->
                <!-- <div
                  class="process"
                  v-if="uploadConfig.process != 0 && uploadConfig.process < 100"
                >{{current_file.process}}</div>-->
              </div>
            </div>
          </div>
          <div v-if="model.node_type== 'gather'">
            <div class="options_item">
              <p>要素详情：</p>
              <div
                class="shape_wwapper"
                v-for="(item,index) in model.children"
                :key="'modelchild'+index"
              >
                <span>{{index+1}}.</span>
                <input
                  type="text"
                  v-model="model.children[index].label"
                  placeholder="请输入内容"
                  @input="updateNode('child_shape','label',model.children[index].label,index)"
                />
                <img src="../../assets/img/graph_shape_delete.png" alt @click="deleteShape(index)" />
              </div>
            </div>
            <div class="options_item" v-if="model.node_type == 'gather'" @click="addChildShape">
              <div class="add_child_shape_btn">
                <img src="../../assets/img/add_child_shapw.png" alt />
                <span>添加子节点</span>
              </div>
            </div>
          </div>
        </template>
        <div class="options_item" @click="deleteNode" v-if="model.node_type != 'root'">
          <div class="delete_wrapper">
            <img src="../../assets/img/graph_delete_node.png" alt />
            <span>删除模块</span>
          </div>
        </div>
      </template>
      <template v-if="model.current_edit == 'inner'">
        <div class="options_item">
          <p>要点内容：</p>
          <div class="node_type_item">
            <input
              type="text"
              v-model="model.children[current_edit_child_index].label"
              placeholder="请输入内容"
              @input="updateNode('child_shape','label',model.children[current_edit_child_index].label,current_edit_child_index)"
            />
          </div>
        </div>
        <div class="options_item">
          <Spin fix v-if="uploadConfig.process!=0">
            <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
            <div>Loading {{uploadConfig.process}} %</div>
          </Spin>
          <p>要点说明：</p>
          <textarea
            v-model="model.children[current_edit_child_index].tags[0].label"
            cols="30"
            rows="10"
            placeholder="请输入内容"
            @input="updateNode('child_shape','key_ponit',model.children[current_edit_child_index].tags[0].label,current_edit_child_index)"
          ></textarea>
          <p>附件支持上传音频/视频/图片：</p>
          <div class="file_wrapper">
            <div
              class="file_item"
              v-for="(item,index) in model.children[current_edit_child_index].tags[0].files"
              :key="'childmodelfile'+index"
              @click="showNodeKeyPointFile(item)"
            >
              <img
                class="cover_tag_png"
                v-if="item.type=='img'"
                src="../../assets/img/graph_file_image.png"
                alt
              />
              <img
                class="cover_tag_png"
                v-if="item.type=='video'"
                src="../../assets/img/graph_file_video.png"
                alt
              />
              <img
                class="cover_tag_png"
                v-if="item.type=='audio'"
                src="../../assets/img/graph_file_audio.png"
                alt
              />
              <img class="pic" :src="item.url" alt />
              <img
                class="delete_png"
                src="../../assets/img/graph_file_delete.png"
                alt
                @click.prevent="deleteKeyPointFile($event,model.children[current_edit_child_index].tags[0].files,index)"
              />
              <div class="mask"></div>
            </div>
            <div class="file_item" @click="uploadFile">
              <img class="add_png" src="../../assets/img/graph_file_add.png" alt />
              <div class="mask"></div>
            </div>
          </div>
        </div>
        <div class="options_item">
          <div class="delete_wrapper" @click="deleteShape(current_edit_child_index)">
            <img src="../../assets/img/graph_delete_node.png" alt />
            <span>删除模块</span>
          </div>
        </div>
      </template>
    </div>
    <Upload
      ref="upload"
      action="http://dscj-app.oss-cn-qingdao.aliyuncs.com"
      :format="['jpg','jpeg','png','mp3','mp4','mov','avi']"
      :data="{}"
      :before-upload="handleBeforeUpload"
      :on-format-error="handleFormatError"
      style="display:none"
    >
      <Button id="graphImgUploadBtn" icon="ios-cloud-upload-outline" />
    </Upload>

    <Modal
      v-model="current_file.show_resource"
      :width="840"
      title="查看资源"
      @on-ok="show_resource=false"
      @on-cancel="show_resource=false"
    >
      <div v-if="current_file.type == 'report'">
        <tables :tabel-height="580" :column="columns2" :table-data="current_file.items" />
      </div>
      <div v-else-if="current_file.type == 'audio'">
        <div v-for="(item,index) in current_file.items" :key="'item'+index">
          <!-- <img style="width:100%" :src="item.url" alt srcset /> -->
          <!-- <video style="width:100%" controls v-if="item.type == 'video'" :src="item.url"></video> -->
          <audio style="width:100%" controls :src="item.url || item.result_media_url"></audio>
        </div>
      </div>
      <div v-else-if="current_file.type == 'img'">
        <div v-for="(item,index) in current_file.items" :key="'item'+index">
          <img style="width:100%" :src="item.url || item.result_media_url" alt srcset />
        </div>
      </div>
      <div v-else-if="current_file.type == 'video'">
        <div v-for="(item,index) in current_file.items" :key="'item'+index">
          <video style="width:100%" controls :src="item.url || item.result_media_url"></video>
        </div>
      </div>
      <div v-else-if="current_file.type == 'ImageData'">
        <div v-for="(item,index) in current_file.items" :key="'item'+index">
          <img v-if="item.type == 'Picture'" style="width: 100%;" :src="componurl + item.report" alt="">
          <video v-else-if="item.type == 'Video'" style="width: 100%;" :src="componurl + item.report"></video>
          <audio v-else-if="item.type == 'Audio'" :src="componurl + item.report"></audio>
          <iframe v-else style="width:800px;height:600px" :frameborder="0" :src="item.report_url"></iframe>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { get_sign } from "../../api/modules/ali_oss";
import axios from "axios";
const ossHost = "http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com";
const media_base_url = "http://sfile.9mededu.com/mtt/Data/main/Cases/";
import tool from "../../tool/tool";
import mixin from "./mixin";
import arrow_up_white from "assets/img/arrow_up_white.png";
import arrow_down_white from "assets/img/arrow_down_white.png";
import arrow_up_gray from "assets/img/arrow_up_gray.png";
import arrow_down_gray from "assets/img/arrow_down_gray.png";
import tables from "../tables";
import officeappsUrl from "../../../config/officeapps";
export default {
  name: "outline-comp",
  props: {
    canedit: {
      type: Boolean,
      default: false,
    },
    dragcanvas: {
      type: Boolean,
      default: false,
    },
    outlinesee: {
      // 查看提纲
      type: Boolean,
      default: false,
    },
    canClick:{
      //点击更换颜色
      type: Boolean,
      default: false
    }
  },
  components: { tables },
  mixins: [mixin],
  data() {
    return {
      arrow_up_white,
      arrow_down_white,
      arrow_up_gray,
      arrow_down_gray,
      current_tag_id: 1,
      componurl:'http://sfile.9mededu.com/mtt/Data/main/Cases/',
      current_file: {
        type: "",
        items: [],
        show_resource: false,
      },
      columns2: [
        { title: "项目", key: "name", minWidth: 100 },
        { title: "缩写", key: "abbreviation", minWidth: 50 },
        { title: "检查结果", key: "value", minWidth: 50 },
        { title: "参考值", key: "refvalue", minWidth: 50 },
        { title: "单位", key: "units", minWidth: 50 },
      ],
      is_show_node_info: false, // 在查看提纲情况下，控制节点信息侧边框显隐
      show_node_info_loading: false,
      current_node_info: {
        diagnosis_key: 1,
        type: "",
        title: "",
        key_points: {
          label: "",
          files: [
            {
              type: "img",
              url: "",
            },
          ],
        },
        data: {},
      },
      // 节点信息图例列表
      legend_list: [
        {
          bg: "#A876F9",
          label: "主要诊断",
        },
        {
          bg: "#FFA003",
          label: "次要诊断",
        },
        {
          bg: "#0AC7E6",
          label: "鉴别诊断",
        },
      ],
      legend_list_map: {
        PrincipalDiagnosis: {
          color: "#A876F9",
        },
        SecondaryDiagnosis: {
          color: "#FFA003",
        },
        DifferentialDiagnosis: {
          color: "#0AC7E6",
        },
      },
      uploadConfig: {
        bucket: "jhyl-static-file",
        dir: "user_task",
        process: 0,
      },
    };
  },
  methods: {
    // 要点文件
    showNodeKeyPointFile(item) {
      this.current_file.items = [];
      this.current_file.type = item.type;
      this.current_file.items.push(item);
      this.current_file.show_resource = true;
    },
    // 要素文件
    showNodeElementFile(type, items) {
      let type_translate = "";
      let need_pre_media_base_url = false;
      switch (type) {
        case "ExaminationReport":
          type_translate = "report";
          need_pre_media_base_url = true;
          break;
        case "Picture":
          type_translate = "img";
          need_pre_media_base_url = true;
          break;
        case "Audio":
          type_translate = "audio";
          need_pre_media_base_url = true;
          break;
        case "Video":
          type_translate = "video";
          need_pre_media_base_url = true;
          break;
        case "ImageData":
          type_translate = "ImageData";
          need_pre_media_base_url = true;
          break;
        case "None":
          type_translate = "None";
          need_pre_media_base_url = true;
          break;
        default:
          type_translate = type;
          break;
      }
      if (type_translate == "None") {
        return;
      }
      this.current_file.type = type_translate;
      // 拼接前缀
      if (need_pre_media_base_url) {
        items.forEach((item) => {
          if(item.result_media_url&&item.result_media_url.indexOf(media_base_url) == -1){
            item.result_media_url = media_base_url + item.result_media_url;
          }
          item.report_url=""
          item.report_url = officeappsUrl + item.report;          
        });
      }
      this.current_file.items = items;
      this.current_file.show_resource = true;
    },
    changeDiagnosisTab(key) {
      this.current_node_info.diagnosis_key = key;
      this.collapse_arr = [];
    },
    // 控制折叠面板
    handleCollapse(key) {
      let key_index = this.collapse_arr.indexOf(key);
      if (key_index == -1) {
        this.collapse_arr.push(key);
      } else {
        this.collapse_arr.splice(key_index, 1);
      }
    },
    uploadFile() {
      document.getElementById("graphImgUploadBtn").click();
    },
    handleFormatError(file) {
      this.$Message.warning("请上传图片");
    },
    handleBeforeUpload(file) {
      let filename = file.name;
      let last_dot_index = filename.lastIndexOf(".");
      let ext = filename.substr(last_dot_index).toLowerCase();
      let fileType = [".jpg", ".jpeg", ".png", ".mp3", ".mp4", ".mov", ".avi"];
      let type_index = fileType.indexOf(ext);

      if (type_index == -1) {
        this.$Message.error("不支持该文件类型");
        return false;
      }
      this.file_type =
        type_index <= 2 ? "img" : type_index == 3 ? "audio" : "video";
      this.handleGetassignKey(file);
      return false;
    },
    handleGetassignKey(file_item, insert) {
      var date = new Date(); //dscj-app,user_task
      date = date.toGMTString();
      get_sign(
        file_item.type,
        date,
        this.uploadConfig.bucket,
        this.uploadConfig.dir,
        file_item.name,
        "post"
      ).then((res) => {
        if (res.data.res_code == 1) {
          const formData = new FormData();
          this.resourse_url = res.data.data.filename;
          formData.append("key", res.data.data.filename);
          formData.append("OSSAccessKeyId", res.data.data.accessKeyID);
          formData.append("success_action_status", "200");
          formData.append("signature", res.data.data.sign);
          formData.append("policy", res.data.data.policyBase64);
          formData.append("file", file_item);
          this.handleUploadFile(formData, encodeURI(ossHost));
        }
      });
    },
    // 上传到oss上
    handleUploadFile(form_data, url) {
      var vm = this;
      let child_index = this.current_edit_child_index;

      axios({
        method: "POST",
        url: url,
        data: form_data,
        onUploadProgress: function (progressEvent) {
          var progress = Math.round(
            progressEvent.lengthComputable
              ? (progressEvent.loaded * 100) / progressEvent.total
              : 0
          );
          if (progress == 100) {
            vm.uploadConfig.process = 0;
            return;
          }
          vm.uploadConfig.process = progress;
        },
      }).then((res) => {
        if (child_index >= 0) {
          vm.model.children[child_index].tags[0].files.push({
            url: url + "/" + vm.resourse_url,
            type: this.file_type,
          });
        } else {
          vm.model.tags[0].files.push({
            url: url + "/" + vm.resourse_url,
            type: this.file_type,
          });
        }
        vm.graph.refresh();
      });
    },
    // 删除当前节点的要点说明文件
    deleteKeyPointFile(event, data, index) {
      event.stopPropagation();
      data.splice(index, 1);
      this.graph.refresh();
    },
  },
  filters: {
    // 数字翻译成汉字
    translateToHans: function (val) {
      val = String(val);
      let res = "";
      switch (val) {
        case "1":
          res = "一";
          break;
        case "2":
          res = "二";
          break;
        case "3":
          res = "三";
          break;
        case "4":
          res = "四";
          break;
        case "5":
          res = "五";
          break;
      }
      return res;
    },
    // 支持依据/排除依据
    translateSupport: function (val) {
      let res = "";
      switch (val) {
        case "SupportingBasis":
          res = "支持依据";
          break;
        case "NonSupportingBasis":
          res = "排除依据";
          break;
        case "medicine":
          res = "药品";
          break;
        case "operation":
          res = "手术";
          break;
        case "nurse":
          res = "护理";
          break;
        case "other":
          res = "其他";
          break;
        case "western_medicine":
          res = "西药";
          break;
        case "chinese_medicine":
          res = "中药";
          break;
        default:
          break;
      }
      return res;
    },
  },
};
</script>

<style scoped lang="less">
@import "style";
</style>