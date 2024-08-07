import {
    AutoSizerProps,
    Grid as _Grid,
    GridCellProps,
    GridCellRenderer,
    GridProps,
    WindowScroller as _WindowScroller,
    AutoSizer as _AutoSizer,
    WindowScrollerProps
} from "react-virtualized";

import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, ContractID } from "@/types/channel";
import { Card, CardFooter } from "@/ui/Token/Card";
import useWindowSize from "@/hooks/useWindowSize";
import { useRef, useEffect } from "react";



/** 

Scrapped implementation of grid windowing for rendering pages of tokens
This was replaced with a simpler implementation that uses the IntersectionObserver API for better UI responsiveness
We will likely use this in the future for better performance

**/



const Grid = (_Grid as unknown) as React.FC<GridProps>;
const WindowScroller = (_WindowScroller as unknown) as React.FC<WindowScrollerProps>;
const AutoSizer = (_AutoSizer as unknown) as React.FC<AutoSizerProps>;


export interface VirtualizedGridItemProps extends GridCellProps {
    tokens: Array<ChannelToken | ChannelTokenV1 | ChannelTokenIntent>;
    columnCount: number;
    channel: Channel;
    spaceName: string;
    contractId: ContractID;
    handleMint: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void;
    handleShare: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void;
    handleManage: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void;
}

export interface TestGridItemProps extends VirtualizedGridItemProps { }

export function TestGridItem({
    tokens,
    columnCount,
    rowIndex,
    columnIndex,
    style,
    channel,
    spaceName,
    contractId,
    handleMint,
    handleShare,
    handleManage
}: TestGridItemProps): JSX.Element {
    const index = rowIndex * columnCount + columnIndex;

    if (index >= tokens.length) {
        return <></>;
    }

    const token = tokens[index];

    return (
        <div style={style} className="flex p-4">
            <div className="cursor-pointer shadow-lg shadow-black hover:shadow-[#262626] no-select rounded-lg w-full">
                <Card
                    key={index}
                    token={token}
                    footer={
                        <CardFooter
                            token={token}
                            channel={channel}
                            spaceName={spaceName}
                            contractId={contractId}
                            handleMint={handleMint}
                            // handleShare={handleShare}
                            handleManage={handleManage}
                        />
                    }
                />
            </div>

            {/* <div className="bg-blue-200 border border-border text-white flex items-center justify-center flex-1 h-full font-bold">
                <Card
                    key={index}
                    token={token}
                    footer={<></>}
                />

            </div> */}

        </div>
    );
}

interface VirtualizedGridProps {
    tokens: Array<ChannelToken | ChannelTokenV1 | ChannelTokenIntent>;
    itemHeight: number;
    aspectRatio: number;
    itemMinWidth: number;
    renderItem: (props: VirtualizedGridItemProps) => JSX.Element;
    numColumns?: number; // explicitly set number of columns
    channel: Channel;
    spaceName: string;
    contractId: ContractID;
    handleMint: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void;
    handleShare: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void;
    handleManage: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void;
}

export function VirtualizedGrid({
    tokens,
    renderItem,
    itemHeight,
    aspectRatio,
    itemMinWidth,
    numColumns,
    channel,
    spaceName,
    contractId,
    handleMint,
    handleShare,
    handleManage
}: VirtualizedGridProps): JSX.Element {
    const gridRef = useRef<any>(null);
    const containerRef = useRef<any>(null);
    const windowSize = useWindowSize();

    useEffect(() => {
        gridRef.current?.recomputeGridSize();
    }, [windowSize]);

    function calculateColumnCount(width: number) {
        if (itemMinWidth + 12 > width) return 1;
        return Math.floor(width / (itemMinWidth + 12)); // Adjust for 12px gap
    }

    function calculateItemWidth(width: number, columnCount: number) {
        return width / columnCount;
    }

    function calculateItemDimensions(width: number, height: number, columnCount: number) {
        // const itemWidth = Math.min((width - (columnCount - 1) * 12) / columnCount, 480); // Adjust for 12px gap
        // const itemHeight = Math.min(itemWidth / aspectRatio, 570); // Calculate height based on aspect ratio
        // return { itemWidth, itemHeight };
        const itemWidth = (width - (columnCount - 1) * 12) / columnCount; // Adjust for 12px gap
        const itemHeight = itemWidth / aspectRatio; // Calculate height based on aspect ratio
        return { itemWidth, itemHeight };
    }

    return (
        <div ref={containerRef} className="flex-1 virtual-grid-container" >
            <WindowScroller>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                    <AutoSizer disableHeight>
                        {({ width }) => {
                            const columnCount = numColumns ?? calculateColumnCount(width);
                            const rowCount = Math.ceil(tokens.length / columnCount);
                            // const itemWidth = calculateItemWidth(width, columnCount);
                            // console.log(height)
                            const { itemWidth, itemHeight } = calculateItemDimensions(width, height, columnCount);

                            return (
                                <Grid
                                    ref={gridRef}
                                    autoHeight
                                    columnCount={columnCount}
                                    columnWidth={itemWidth}
                                    width={width}
                                    height={height}
                                    rowCount={rowCount}
                                    rowHeight={itemHeight}
                                    isScrolling={isScrolling}
                                    scrollTop={scrollTop}
                                    onScroll={onChildScroll}
                                    cellRenderer={(props: GridCellProps) => {
                                        const fullProps: VirtualizedGridItemProps = {
                                            ...props,
                                            tokens,
                                            columnCount,
                                            channel,
                                            spaceName,
                                            contractId,
                                            handleMint,
                                            handleShare,
                                            handleManage
                                        };
                                        return renderItem(fullProps);
                                    }}
                                />
                            );
                        }}
                    </AutoSizer>
                )}
            </WindowScroller>
        </div>
    );
}

const MapTokens = ({
    tokens,
    channel,
    spaceName,
    contractId,
    handleMint,
    handleShare,
    handleManage
}: {
    tokens: Array<ChannelToken | ChannelTokenV1 | ChannelTokenIntent>,
    channel: Channel,
    spaceName: string,
    contractId: ContractID,
    handleMint: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,
    handleShare: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,
    handleManage: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void
}) => {
    return (
        <div>
            <VirtualizedGrid
                tokens={tokens}
                aspectRatio={0.75 / 1}
                channel={channel}
                spaceName={spaceName}
                contractId={contractId}
                handleMint={handleMint}
                handleShare={handleShare}
                handleManage={handleManage}
                itemHeight={415}
                itemMinWidth={300}
                renderItem={(props: VirtualizedGridItemProps) => (
                    <TestGridItem {...props} />
                )}
            />
        </div>
    );
}
