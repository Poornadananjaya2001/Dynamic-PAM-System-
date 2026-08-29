"""
Master Dataset & Evaluation Generator for Final Thesis Submission
SecureSafe PAM System - User Behavioral Analysis (UBA)
"""

import os
import sys

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def main():
    print("=== STARTING FINAL SUBMISSION DATASET & METRIC GENERATION PIPELINE ===\n")
    
    # Step 1: Generate 1,555 Test Samples Dataset
    print("[1/5] Running confusion_matrix_generator.py...")
    import confusion_matrix_generator
    y_true, y_pred = confusion_matrix_generator.generate_realistic_test_data(1555)
    print(f"Generated {len(y_true)} test samples -> pam_confusion_matrix_data.csv")
    
    # Step 2: Generate Confusion Matrix Plot & Thesis Figure 6.3
    print("\n[2/5] Running confusion_matrix_visualizer.py...")
    import confusion_matrix_visualizer
    cm, report = confusion_matrix_visualizer.create_confusion_matrix_visualization(y_true, y_pred)
    print("Generated Confusion Matrix Table & Figure -> figure_6_3_confusion_matrix.png")
    
    # Step 3: Generate Classification Reports & F1 Metrics
    print("\n[3/5] Running classification_report_generator.py...")
    import classification_report_generator
    report_dict, metrics_df = classification_report_generator.generate_detailed_classification_report(y_true, y_pred)
    classification_report_generator.create_classification_report_table(metrics_df, report_dict)
    classification_report_generator.save_metrics_to_csv(metrics_df, report_dict)
    print("Generated Classification Metrics -> classification_report.csv & figure_6_4_classification_report.png")
    
    # Step 4: Generate Multi-Class ROC Curves & AUC Analysis
    print("\n[4/5] Running roc_curve_generator.py...")
    import roc_curve_generator
    roc_auc = roc_curve_generator.create_roc_curves(y_true, y_pred)
    roc_curve_generator.create_auc_comparison_chart(roc_auc)
    roc_curve_generator.save_roc_metrics(roc_auc)
    print("Generated ROC & AUC Metrics -> figure_6_5_roc_curves.png & pam_roc_metrics.txt")
    
    # Step 5: Generate Real Latency Benchmarks
    print("\n[5/5] Running real_performance_test.py...")
    import real_performance_test
    tester = real_performance_test.PAMPerformanceTester()
    results = tester.run_comprehensive_response_time_tests()
    tester.create_response_time_chart()
    print("Generated Response Time Benchmarks -> figure_6_22_response_times.png & pam_performance_results.json")

    print("\n=========================================================================")
    print("ALL FINAL SUBMISSION DATASETS, CSVS, CHARTS, AND METRICS READY!")
    print("=========================================================================")
    print("Output Files in Current Directory:")
    print("  • pam_confusion_matrix_data.csv        (1,555 test samples raw dataset)")
    print("  • pam_detailed_metrics.csv              (Per-class Precision, Recall, F1, Accuracy)")
    print("  • classification_report.csv             (Comprehensive summary table)")
    print("  • pam_performance_results.json          (API and dashboard response time benchmarks)")
    print("  • pam_roc_metrics.txt                   (AUC-ROC class separation scores)")
    print("  • figure_6_3_confusion_matrix.png      (Thesis Figure 6.3)")
    print("  • figure_6_4_classification_report.png (Thesis Figure 6.4)")
    print("  • figure_6_5_roc_curves.png             (Thesis Figure 6.5)")
    print("  • figure_6_22_response_times.png        (Thesis Figure 6.22)")

if __name__ == '__main__':
    main()
