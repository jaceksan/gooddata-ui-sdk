// (C) 2019-2020 GoodData Corporation
import { ISeparators } from "@gooddata/numberjs";
import { IAnalyticalBackend, IExecutionFactory } from "@gooddata/sdk-backend-spi";
import { IColorPalette, IInsight, ITotal, VisualizationProperties } from "@gooddata/sdk-model";
import {
    ChartType,
    IDrillableItem,
    ILocale,
    IPushData,
    IVisualizationCallbacks,
    OverTimeComparisonType,
    VisualizationEnvironment,
} from "../../base";

export interface IFeatureFlags {
    [property: string]: string | boolean | number;
}

export type RenderFunction = (component: any, target: Element) => void;

export interface IVisConstruct {
    backend: IAnalyticalBackend;
    projectId: string;
    element: string;
    configPanelElement: string;
    callbacks: IVisCallbacks;
    environment?: VisualizationEnvironment;
    locale?: ILocale;
    featureFlags?: IFeatureFlags;
    visualizationProperties: VisualizationProperties;
    renderFun: RenderFunction;
}

export interface ICustomProps {
    stickyHeaderOffset?: number;
    drillableItems?: IDrillableItem[];
    totalsEditAllowed?: boolean;
}

export interface IDimensions {
    width?: number; // Note: will not be optional once we start sending it
    height: number;
}

export interface IVisProps {
    dimensions?: IDimensions;
    custom?: ICustomProps;
    locale?: ILocale;
    config?: IGdcConfig;
}

export interface IVisualizationOptions {
    dateOptionsDisabled: boolean;
}

export interface IVisCallbacks extends IVisualizationCallbacks {
    pushData(data: IPushData, options?: IVisualizationOptions): void;
}

export interface IBucketFilterElement {
    title: string;
    uri: string;
}

export type ComparisonConditionOperator =
    | "GREATER_THAN"
    | "GREATER_THAN_OR_EQUAL_TO"
    | "LESS_THAN"
    | "LESS_THAN_OR_EQUAL_TO"
    | "EQUAL_TO"
    | "NOT_EQUAL_TO";

export interface IComparisonCondition {
    readonly operator: ComparisonConditionOperator;
    readonly value: number;
}

export type RangeConditionOperator = "BETWEEN" | "NOT_BETWEEN";

export interface IRangeCondition {
    readonly operator: RangeConditionOperator;
    readonly from: number;
    readonly to: number;
}

export type IMeasureValueFilterCondition = IComparisonCondition | IRangeCondition;

export interface IBucketFilterInterval {
    granularity: string;
    interval: string[];
    name: string;
}

export interface IBucketFilter {
    allElements?: IBucketFilterElement[];
    attribute?: string;
    interval?: IBucketFilterInterval;
    isInverted?: boolean;
    isModified?: boolean;
    noData?: boolean;
    selectedElements?: IBucketFilterElement[];
    totalElementsCount?: number;
    overTimeComparisonType?: OverTimeComparisonType;
    measureLocalIdentifier?: string;
    condition?: IMeasureValueFilterCondition;
}

export interface ISort {
    direction: "asc" | "desc";
}

export interface IBucketItem {
    localIdentifier: string;
    type?: string;
    aggregation?: boolean;
    attribute?: string;
    filters?: IBucketFilter[];
    granularity?: string;
    showInPercent?: boolean;
    showOnSecondaryAxis?: boolean;
    sort?: ISort;
    masterLocalIdentifier?: string;
    overTimeComparisonType?: OverTimeComparisonType;
    operandLocalIdentifiers?: Array<string | null> | null;
    operator?: string | null;
}

export interface IFiltersBucketItem extends IBucketItem {
    autoCreated?: boolean;
}

// TODO: SDK8: rename this :) the original name IBucket conflicted with what we have in model;
// this interface and all the other similar interface (bucket item, filters etc) are specifically used
// in the reference point
export interface IBucketOfFun {
    localIdentifier: string;
    items: IBucketItem[];
    totals?: ITotal[];
    chartType?: string;
}

export interface IFilters {
    localIdentifier: "filters";
    items: IFiltersBucketItem[];
}

export interface IRecommendations {
    [key: string]: boolean;
}

export interface IBucketUiConfig {
    accepts?: string[];
    canAddItems?: boolean;
    warningMessage?: string;
    title?: string;
    subtitle?: string;
    icon?: string;
    allowsDuplicateItems?: boolean;
    allowsReordering?: boolean;
    allowsSwapping?: boolean;
    enabled?: boolean;
    itemsLimit?: number;
    isShowInPercentEnabled?: boolean;
    isShowInPercentVisible?: boolean;
    isShowOnSecondaryAxisVisible?: boolean;
    allowShowOnSecondaryAxis?: boolean;
    allowSelectChartType?: boolean;
    allowOptionalStacking?: boolean;
}

export interface IBucketsUiConfig {
    [localIdentifier: string]: IBucketUiConfig;
}

export interface IExportUiConfig {
    supported?: boolean;
}

export interface IOpenAsReportUiConfig {
    supported?: boolean;
    warningMessage?: string;
}

export interface ICustomError {
    heading: string;
    text: string;
}

export interface IOptionalStacking {
    supported?: boolean;
    disabled?: boolean;
    stackMeasures?: boolean;
    stackMeasuresToPercent?: boolean;
    canStackInPercent?: boolean;
}

export interface IUiConfig {
    buckets: IBucketsUiConfig;
    recommendations?: IRecommendations;
    exportConfig?: IExportUiConfig;
    openAsReport?: IOpenAsReportUiConfig;
    customError?: ICustomError;
    supportedOverTimeComparisonTypes?: OverTimeComparisonType[];
    supportedChartTypes?: ChartType[];
    axis?: string;
    optionalStacking?: IOptionalStacking;
}

export interface IVisualizationProperties {
    // This can be anything depending on a visualization type
    // perhaps consider adding: sortItems?: AFM.SortItem[]
    [property: string]: any;
}

export interface IReferencePoint {
    buckets: IBucketOfFun[];
    filters: IFilters;
    properties?: IVisualizationProperties; // properties are under plugvis creator's control
}

export interface IReferences {
    [identifier: string]: string;
}

export interface IExtendedReferencePoint {
    buckets: IBucketOfFun[];
    filters: IFilters;
    properties?: IVisualizationProperties; // properties are under plugvis creator's control
    uiConfig: IUiConfig;
}

export interface IVisualization {
    // visualizationProperties are used for visualization configuration
    update(props: IVisProps, insight: IInsight, executionFactory: IExecutionFactory): void;

    unmount(): void;

    addNewDerivedBucketItems(
        referencePoint: IReferencePoint,
        newDerivedBucketItems: IBucketItem[],
    ): Promise<IReferencePoint>;

    /**
     * Called every time the reference point or the visualization class change
     * to allow visualizations to get updated ExtendedReferencePoint.
     * @param referencePoint The new value of the reference point.
     * @param previousReferencePoint The previous value of the reference point.
     * This value is only provided if the visualization class was not changed
     * (i. e. both points are related to the same visualization class).
     * @returns Promise of the new ExtendedReferencePoint.
     */
    getExtendedReferencePoint(
        referencePoint: IReferencePoint,
        previousReferencePoint?: IReferencePoint,
    ): Promise<IExtendedReferencePoint>;
}

export interface IGdcConfig {
    separators?: ISeparators;
    colorPalette?: IColorPalette;
}

/**
 * Class name of element where pluggable visualization is supposed to render its configuration
 * panels.
 *
 * @alpha
 */
export const ConfigPanelClassName = "gd-configuration-panel-content";
