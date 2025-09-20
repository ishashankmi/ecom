import Carousel from 'react-multi-carousel';
import { shuffleItems } from '../../utils/helper';
import { ProductItem } from '../../utils/types';
import CarouselButtonGroup from '../CarouselButtonGroup';
import ProductCard from '../ProductCard';
import 'react-multi-carousel/lib/styles.css';

type Props = {
  topItems: ProductItem[];
};

const responsive = {
  desktop: {
    breakpoint: { max: 1920, min: 768 },
    items: 2,
    slidesToSlide: 1,
    partialVisibilityGutter: 10,
  },
  tablet: {
    breakpoint: { max: 768, min: 480 },
    items: 2,
    slidesToSlide: 1,
    partialVisibilityGutter: 5,
  },
  mobile: {
    breakpoint: { max: 480, min: 0 },
    items: 1.5,
    slidesToSlide: 1,
    partialVisibilityGutter: 20,
  },
};

const SuggestedItems = (props: Props) => {
  const items = shuffleItems(props.topItems);

  return (
    <div className="pb-3 flex relative mx-2">
      <div className="flex-1 overflow-auto -mr-5 -ml-1">
        <Carousel
          swipeable={true}
          draggable={true}
          responsive={responsive}
          arrows={false}
          renderButtonGroupOutside={true}
          customButtonGroup={<CarouselButtonGroup />}
          shouldResetAutoplay={false}
          infinite={false}
          itemClass="px-1"
          partialVisible
        >
          {items?.map((item, i) => (
            <ProductCard key={i} product={item} />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default SuggestedItems;
