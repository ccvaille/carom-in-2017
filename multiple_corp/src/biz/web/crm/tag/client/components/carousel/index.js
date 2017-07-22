import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Carousel, Button} from 'antd';

import { closeGuide } from '../../actions/label.js';

import './index.less'
const IMAGE_DATA = {
	head: {
		src: require('../../../../../../../comm/public/images/side-head.png'),
		alt: ''
	},
	side1: {
		src: require('../../../../../../../comm/public/images/side-1.png'),
		alt: ''
	},
	side2: {
		src: require('../../../../../../../comm/public/images/side-2.png'),
		alt: ''
	},
	side3: {
		src: require('../../../../../../../comm/public/images/side-3.png'),
		alt: ''
	},
	side4: {
		src: require('../../../../../../../comm/public/images/side-4.png'),
		alt: ''
	},
	side5: {
		src: require('../../../../../../../comm/public/images/side-5.png'),
		alt: ''
	},
	side6: {
		src: require('../../../../../../../comm/public/images/side6.png'),
		alt: ''
	}
}
class Crmcarousel extends React.Component {
	hideCarousel() {
		const { dispatch } = this.props;
		dispatch(closeGuide());
	}
	render () {
		const { isShowGuide } = this.props.postsByReddit;
	    return (
	    	<div style={{display: isShowGuide ? 'block' : 'none'}}>
		    	<div className="carousel-mask">
		    	</div>,
		    	<div className="carousel-container">
		    			<div className="head">
					    	<img src={IMAGE_DATA.head.src} alt={IMAGE_DATA.head.alt} className="head-img"/>
					    </div>
			    	<Carousel effect="scrollx" dots={true} autoplay={true} autoplaySpeed={5000}>
					    <div className="side side-left">
					    	<div className="contain">
					    		<div className="left">
					    			<h2>分组管理，标签分类更轻松</h2>
					    			<p>新版标签提供标签一站式的分类管理，查找标签不再是难事。</p>
						    		<Button key="submit"
					                        type="primary"
					                        className=""
			                        		onClick={ this.hideCarousel.bind(this) }>
			                    		马上体验
			                		</Button>
					    		</div>
					    		<div className="right">
					    			<img src={IMAGE_DATA.side1.src} alt={IMAGE_DATA.side1.alt} className="mgt20"/>
					    		</div>
					    	</div>
					    	
					    </div>
					    <div className="side side-right">
					    	<div className="contain">
					    		<div className="left">
					    			<img src={IMAGE_DATA.side2.src} alt={IMAGE_DATA.side2.alt}/>
					    		</div>
					    		<div className="right">
					    			<h2>选择方式，随意设定</h2>
					    			<p>新版标签可以随意设定某个标签的分组是单选还是多选，提升标签的灵活性。</p>
						    		<Button key="submit"
					                        type="primary"
					                        className="experience"
			                        		onClick={ this.hideCarousel.bind(this) }>
			                    		马上体验
			                		</Button>
					    		</div>
					    	</div>
					    </div>
					    <div className="side side-right">
					    	<div className="contain">
					    		<div className="left">
					    			<img src={IMAGE_DATA.side3.src} alt={IMAGE_DATA.side3.alt}/>
					    		</div>
					    		<div className="right">
					    			<h2>颜色标记，增强辨别能力</h2>
					    			<p>提供20种标签颜色设定，提升提升销售员在跟进客户过程中对不同的标签有不同的重视程度。</p>
						    		<Button key="submit"
					                        type="primary"
					                        className="experience"
			                        		onClick={ this.hideCarousel.bind(this) }>
			                    		马上体验
			                		</Button>
					    		</div>
					    	</div>
					    </div>
					    <div className="side side-left">
					    	<div className="contain">
					    		<div className="left">
					    			<h2>拖拽移动，快捷管理</h2>
					    			<p>移动标签不再是难事，鼠标拖动标签即可移动到想要的位置。。</p>
						    		<Button key="submit"
					                        type="primary"
					                        className="experience"
			                        		onClick={ this.hideCarousel.bind(this) }>
			                    		马上体验
			                		</Button>
					    		</div>
					    		<div className="right">
					    			<img src={IMAGE_DATA.side4.src} alt={IMAGE_DATA.side4.alt}/>
					    		</div>
					    	</div>
					    </div>
					    <div className="side side-right">
					    	<div className="contain">
					    		<div className="left">
					    			<img src={IMAGE_DATA.side5.src} alt={IMAGE_DATA.side5.alt}/>
					    		</div>
					    		<div className="right">
					    			<h2>批量操作，提升效率</h2>
					    			<p>进入“批量管理”可以批量删除标签或将标签移动到其他分组。</p>
						    		<Button key="submit"
					                        type="primary"
					                        className="experience"
			                        		onClick={ this.hideCarousel.bind(this) }>
			                    		马上体验
			                		</Button>
					    		</div>
					    		
					    	</div>
					    </div>
					    <div className="side side-left">
					    	<div className="contain">
					    		<div className="left">
					    			<h2>旧标签无忧升级到新版</h2>
					    			<p>未分组的标签已移动到“未整理的标签”中，您可以通过“批量管理”对该分组的标签进行管理</p>
						    		<Button key="submit"
					                        type="primary"
					                        className="experience"
			                        		onClick={ this.hideCarousel.bind(this) }>
			                    		马上体验
			                		</Button>
					    		</div>
					    		<div className="right">
					    			<img src={IMAGE_DATA.side6.src} alt={IMAGE_DATA.side6.alt}/>
					    		</div>
					    	</div>
					    </div>
				  	</Carousel>
	                <a href="javascript:void(0)" className="close-x" 
	                	onClick={ this.hideCarousel.bind(this) }>×</a>
			  	</div>
		  	</div>
	    )
  	}
}
function mapStateToProps(state) {
    const {postsByReddit} = state;
    return {postsByReddit}
}
export default connect(mapStateToProps)(Crmcarousel);
