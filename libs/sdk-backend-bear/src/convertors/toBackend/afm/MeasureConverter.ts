// (C) 2007-2020 GoodData Corporation
import {
    IArithmeticMeasureDefinition,
    IMeasure,
    IMeasureDefinition,
    IMeasureDefinitionType,
    IPoPMeasureDefinition,
    IPreviousPeriodMeasureDefinition,
    isArithmeticMeasureDefinition,
    isMeasureDefinition,
    isPoPMeasureDefinition,
    isPreviousPeriodMeasureDefinition,
} from "@gooddata/sdk-model";
import { GdcExecuteAFM } from "@gooddata/api-model-bear";
import { convertMeasureFilter } from "./FilterConverter";
import { toBearRef } from "../ObjRefConverter";
import compact from "lodash/compact";
import { DEFAULT_INTEGER_FORMAT, DEFAULT_PERCENTAGE_FORMAT, DEFAULT_DECIMAL_FORMAT } from "./constants";

export function convertMeasure(measure: IMeasure): GdcExecuteAFM.IMeasure {
    const {
        measure: { definition },
    } = measure;

    const convertedDefinition = convertMeasureDefinition(definition);

    const format = getFormat(measure);
    const formatProp = format ? { format } : {};

    const alias = measure.measure.alias ? measure.measure.alias : measure.measure.title;
    const aliasProp = alias ? { alias } : {};

    return {
        localIdentifier: measure.measure.localIdentifier,
        definition: convertedDefinition,
        ...aliasProp,
        ...formatProp,
    };
}

function convertMeasureDefinition(definition: IMeasureDefinitionType): GdcExecuteAFM.MeasureDefinition {
    if (isMeasureDefinition(definition)) {
        return convertSimpleMeasureDefinition(definition);
    } else if (isPoPMeasureDefinition(definition)) {
        return convertPopMeasureDefinition(definition);
    } else if (isPreviousPeriodMeasureDefinition(definition)) {
        return convertPreviousPeriodMeasureDefinition(definition);
    } else if (isArithmeticMeasureDefinition(definition)) {
        return convertArithmeticMeasureDefinition(definition);
    } else {
        throw Error("The measure definition is not supported: " + JSON.stringify(definition));
    }
}

function convertSimpleMeasureDefinition(
    definition: IMeasureDefinition,
): GdcExecuteAFM.ISimpleMeasureDefinition {
    const { measureDefinition } = definition;

    const filters: GdcExecuteAFM.FilterItem[] = measureDefinition.filters
        ? compact(measureDefinition.filters.map(convertMeasureFilter))
        : [];
    const filtersProp = filters.length ? { filters } : {};

    const aggregation = measureDefinition.aggregation;
    const aggregationProp = aggregation ? { aggregation } : {};

    const computeRatio = measureDefinition.computeRatio;
    const computeRatioProp = computeRatio ? { computeRatio } : {};

    return {
        measure: {
            item: toBearRef(measureDefinition.item),
            ...filtersProp,
            ...aggregationProp,
            ...computeRatioProp,
        },
    };
}

function convertPopMeasureDefinition(definition: IPoPMeasureDefinition): GdcExecuteAFM.IPopMeasureDefinition {
    const { popMeasureDefinition } = definition;
    return {
        popMeasure: {
            measureIdentifier: popMeasureDefinition.measureIdentifier,
            popAttribute: toBearRef(popMeasureDefinition.popAttribute),
        },
    };
}

function convertPreviousPeriodMeasureDefinition(
    definition: IPreviousPeriodMeasureDefinition,
): GdcExecuteAFM.IPreviousPeriodMeasureDefinition {
    const { previousPeriodMeasure } = definition;
    return {
        previousPeriodMeasure: {
            measureIdentifier: previousPeriodMeasure.measureIdentifier,
            dateDataSets: previousPeriodMeasure.dateDataSets.map((dateDataSet) => ({
                dataSet: toBearRef(dateDataSet.dataSet),
                periodsAgo: dateDataSet.periodsAgo,
            })),
        },
    };
}

function convertArithmeticMeasureDefinition(
    definition: IArithmeticMeasureDefinition,
): GdcExecuteAFM.IArithmeticMeasureDefinition {
    const { arithmeticMeasure } = definition;
    return {
        arithmeticMeasure: {
            measureIdentifiers: arithmeticMeasure.measureIdentifiers.slice(),
            operator: arithmeticMeasure.operator,
        },
    };
}

function getFormat(measure: IMeasure): string | undefined {
    const {
        measure: { definition, format },
    } = measure;

    // Override incorrect formats of ad-hoc measures with computeRatio
    // and use decimal percentage  instead.
    // This code will be removed once saved viz. objects are fixed in BB-2287
    if (isMeasureDefinition(definition)) {
        const { measureDefinition } = definition;
        if (measureDefinition.computeRatio && measureDefinition.aggregation) {
            if (measureDefinition.aggregation === "count") {
                if (format === DEFAULT_INTEGER_FORMAT) {
                    return DEFAULT_PERCENTAGE_FORMAT;
                }
            } else {
                if (format === DEFAULT_DECIMAL_FORMAT) {
                    return DEFAULT_PERCENTAGE_FORMAT;
                }
            }
        }
    }

    if (format) {
        return format;
    }

    const isArithmeticMeasureChange =
        isArithmeticMeasureDefinition(definition) && definition.arithmeticMeasure.operator === "change";

    if (isArithmeticMeasureChange) {
        return DEFAULT_PERCENTAGE_FORMAT;
    }

    if (isMeasureDefinition(definition)) {
        const { measureDefinition } = definition;
        if (measureDefinition.computeRatio) {
            return DEFAULT_PERCENTAGE_FORMAT;
        }
        if (measureDefinition.aggregation === "count") {
            return DEFAULT_INTEGER_FORMAT;
        }
    }

    return undefined;
}
