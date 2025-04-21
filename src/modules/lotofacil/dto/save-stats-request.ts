import { LotofacilResultsEntity } from "../domain/lotofacil-results.entity";

interface FrequencyStat {
    number: string;
    quantity: number;
}

interface CompanionStat {
    number: string;
    most_frequent: FrequencyStat[];
}

interface AverageGapStat {
    number: string;
    avg_gap: number;
    median_gap: number;
    min_gap: number;
    max_gap: number;
    total_appearances: number;
}

interface AverageGapStat {
    number: string;
    avg_gap: number;
}

type SimplePredictionStat = string[];

interface TrainedPredictionStat {
    DecisionTree: string[];
    KNN: string[];
}

export class SaveStatsRequest {
    frequency_stats?: FrequencyStat[];
    companion_stats?: CompanionStat[];
    last_results?: LotofacilResultsEntity[];
    average_gap_stats?: AverageGapStat[];
    simple_predictions?: SimplePredictionStat[];
    trained_predictions?: TrainedPredictionStat[];
}
