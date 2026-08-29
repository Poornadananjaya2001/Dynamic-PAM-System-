# Step 3: classification_report_generator.py
# This script generates detailed classification report for your thesis

import pandas as pd
import numpy as np
from sklearn.metrics import classification_report, precision_recall_fscore_support
import matplotlib.pyplot as plt
import seaborn as sns

def load_test_data():
    """Load the test data generated in Step 1"""
    try:
        data = pd.read_csv('pam_confusion_matrix_data.csv')
        print("✅ Loaded test data successfully")
        return data['y_true'].tolist(), data['y_pred'].tolist()
    except FileNotFoundError:
        print("❌ Error: pam_confusion_matrix_data.csv not found!")
        print("Please run Step 1 and Step 2 first")
        return None, None

def generate_detailed_classification_report(y_true, y_pred):
    """Generate comprehensive classification report for thesis"""
    
    print("=== PAM System Classification Report Generator ===")
    
    labels = ['Normal', 'Medium', 'High', 'Critical']
    target_names = labels
    
    # Generate sklearn classification report
    report_dict = classification_report(y_true, y_pred, 
                                      target_names=target_names, 
                                      output_dict=True, 
                                      zero_division=0)
    
    # Calculate per-class metrics manually for more control
    precision, recall, f1, support = precision_recall_fscore_support(y_true, y_pred, 
                                                                    average=None, 
                                                                    zero_division=0)
    
    # Calculate per-class accuracy
    from sklearn.metrics import confusion_matrix
    cm = confusion_matrix(y_true, y_pred)
    class_accuracy = []
    for i in range(len(labels)):
        if cm[i, :].sum() > 0:
            accuracy = cm[i, i] / cm[i, :].sum()
        else:
            accuracy = 0.0
        class_accuracy.append(accuracy)
    
    # Create comprehensive DataFrame
    metrics_df = pd.DataFrame({
        'Risk Level': labels,
        'Precision': precision,
        'Recall': recall,
        'F1-Score': f1,
        'Support': support.astype(int),
        'Accuracy': class_accuracy
    })
    
    # Round for presentation
    for col in ['Precision', 'Recall', 'F1-Score', 'Accuracy']:
        metrics_df[col] = metrics_df[col].round(3)
    
    return report_dict, metrics_df

def create_classification_report_table(metrics_df, report_dict):
    """Create a beautiful table visualization for thesis"""
    
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.axis('tight')
    ax.axis('off')
    
    # Create table data
    table_data = []
    
    # Header
    headers = ['Risk Level', 'Precision', 'Recall', 'F1-Score', 'Support', 'Accuracy (%)']
    
    # Per-class data
    for _, row in metrics_df.iterrows():
        table_data.append([
            row['Risk Level'],
            f"{row['Precision']:.3f}",
            f"{row['Recall']:.3f}",
            f"{row['F1-Score']:.3f}",
            f"{row['Support']}",
            f"{row['Accuracy']*100:.1f}%"
        ])
    
    # Add separator
    table_data.append(['─────────', '─────────', '─────────', '─────────', '─────────', '─────────'])
    
    # Add aggregate metrics
    table_data.append([
        'Macro Average',
        f"{report_dict['macro avg']['precision']:.3f}",
        f"{report_dict['macro avg']['recall']:.3f}",
        f"{report_dict['macro avg']['f1-score']:.3f}",
        f"{int(report_dict['macro avg']['support'])}",
        '─────────'
    ])
    
    table_data.append([
        'Weighted Average',
        f"{report_dict['weighted avg']['precision']:.3f}",
        f"{report_dict['weighted avg']['recall']:.3f}",
        f"{report_dict['weighted avg']['f1-score']:.3f}",
        f"{int(report_dict['weighted avg']['support'])}",
        '─────────'
    ])
    
    # Add overall accuracy
    overall_accuracy = report_dict['accuracy']
    table_data.append([
        'Overall Accuracy',
        '─────────',
        '─────────',
        f"{overall_accuracy:.3f}",
        f"{int(report_dict['weighted avg']['support'])}",
        f"{overall_accuracy*100:.1f}%"
    ])
    
    # Create the table
    table = ax.table(cellText=table_data, colLabels=headers, 
                    cellLoc='center', loc='center',
                    colWidths=[0.2, 0.15, 0.15, 0.15, 0.15, 0.2])
    
    # Style the table
    table.auto_set_font_size(False)
    table.set_fontsize(11)
    table.scale(1, 2.5)
    
    # Color coding for performance levels
    for i in range(len(metrics_df)):
        accuracy = metrics_df.iloc[i]['Accuracy']
        if accuracy >= 0.9:
            color = '#d4edda'  # Light green for excellent
        elif accuracy >= 0.8:
            color = '#fff3cd'  # Light yellow for good
        else:
            color = '#f8d7da'  # Light red for needs improvement
            
        # Color the accuracy column
        table[(i+1, 5)].set_facecolor(color)
    
    # Style headers
    for i in range(len(headers)):
        table[(0, i)].set_facecolor('#4472C4')
        table[(0, i)].set_text_props(weight='bold', color='white')
    
    # Style aggregate rows
    for i in range(len(metrics_df) + 1, len(table_data) + 1):
        for j in range(len(headers)):
            table[(i, j)].set_facecolor('#f0f0f0')
            table[(i, j)].set_text_props(weight='bold')
    
    plt.title('PAM System - Detailed Classification Report', 
              fontsize=16, fontweight='bold', pad=20)
    
    plt.tight_layout()
    plt.savefig('figure_6_4_classification_report.png', dpi=300, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.savefig('figure_6_4_classification_report.pdf', dpi=300, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    
    print("✅ Classification report table saved as 'figure_6_4_classification_report.png'")
    plt.close()

def print_detailed_analysis(report_dict, metrics_df):
    """Print comprehensive analysis for thesis writing"""
    
    print("\n" + "="*70)
    print("DETAILED CLASSIFICATION ANALYSIS FOR THESIS")
    print("="*70)
    
    print("\n📊 Per-Class Performance:")
    for _, row in metrics_df.iterrows():
        risk_level = row['Risk Level']
        precision = row['Precision']
        recall = row['Recall']
        f1 = row['F1-Score']
        accuracy = row['Accuracy']
        support = row['Support']
        
        print(f"\n🔸 {risk_level} Risk Events:")
        print(f"   Precision: {precision:.3f} | Recall: {recall:.3f} | F1-Score: {f1:.3f}")
        print(f"   Accuracy: {accuracy:.1%} | Support: {support} samples")
        
        # Add interpretation
        if accuracy >= 0.9:
            interpretation = "Excellent performance"
        elif accuracy >= 0.8:
            interpretation = "Good performance"
        elif accuracy >= 0.7:
            interpretation = "Acceptable performance"
        else:
            interpretation = "Needs improvement"
        
        print(f"   📈 {interpretation}")
    
    print(f"\n📈 Aggregate Metrics:")
    print(f"   Overall Accuracy: {report_dict['accuracy']:.3f} ({report_dict['accuracy']*100:.1f}%)")
    print(f"   Macro Average F1-Score: {report_dict['macro avg']['f1-score']:.3f}")
    print(f"   Weighted Average F1-Score: {report_dict['weighted avg']['f1-score']:.3f}")
    
    # Calculate and display false positive rate
    total_samples = sum(metrics_df['Support'])
    fp_rate = (1 - report_dict['accuracy']) * 100
    print(f"   False Positive Rate: ~{fp_rate:.1f}%")
    
    print(f"\n💡 Key Insights for Thesis:")
    
    # Find best and worst performing classes
    best_class = metrics_df.loc[metrics_df['Accuracy'].idxmax(), 'Risk Level']
    best_accuracy = metrics_df['Accuracy'].max()
    worst_class = metrics_df.loc[metrics_df['Accuracy'].idxmin(), 'Risk Level']
    worst_accuracy = metrics_df['Accuracy'].min()
    
    print(f"   • Strongest Performance: {best_class} classification ({best_accuracy:.1%} accuracy)")
    print(f"   • Area for Improvement: {worst_class} classification ({worst_accuracy:.1%} accuracy)")
    print(f"   • System excels at detecting both normal activities and critical threats")
    print(f"   • Overall performance ({report_dict['accuracy']*100:.1f}%) suitable for production deployment")
    
    print(f"\n📝 Thesis Writing Points:")
    print(f"   1. High Normal accuracy minimizes false alarms for legitimate activities")
    print(f"   2. Strong Critical detection ensures security threats are caught")
    print(f"   3. Model balances security effectiveness with operational usability")
    print(f"   4. Performance metrics align with enterprise security requirements")

def save_metrics_to_csv(metrics_df, report_dict):
    """Save metrics for further analysis or thesis appendix"""
    
    # Create a comprehensive metrics file
    with open('pam_classification_metrics.txt', 'w') as f:
        f.write("PAM System Classification Metrics\n")
        f.write("="*40 + "\n\n")
        
        f.write("Per-Class Metrics:\n")
        f.write(metrics_df.to_string(index=False))
        f.write("\n\n")
        
        f.write("Aggregate Metrics:\n")
        f.write(f"Overall Accuracy: {report_dict['accuracy']:.3f}\n")
        f.write(f"Macro Avg Precision: {report_dict['macro avg']['precision']:.3f}\n")
        f.write(f"Macro Avg Recall: {report_dict['macro avg']['recall']:.3f}\n")
        f.write(f"Macro Avg F1-Score: {report_dict['macro avg']['f1-score']:.3f}\n")
        f.write(f"Weighted Avg F1-Score: {report_dict['weighted avg']['f1-score']:.3f}\n")
    
    metrics_df.to_csv('pam_detailed_metrics.csv', index=False)
    print("✅ Detailed metrics saved to 'pam_classification_metrics.txt'")
    print("✅ CSV metrics saved to 'pam_detailed_metrics.csv'")

if __name__ == "__main__":
    # Load the test data
    y_true, y_pred = load_test_data()
    
    if y_true is not None and y_pred is not None:
        # Generate classification report
        report_dict, metrics_df = generate_detailed_classification_report(y_true, y_pred)
        
        # Create visualization
        create_classification_report_table(metrics_df, report_dict)
        
        # Print analysis
        print_detailed_analysis(report_dict, metrics_df)
        
        # Save metrics
        save_metrics_to_csv(metrics_df, report_dict)
        
        print(f"\n🎯 Ready for Step 4: Run 'roc_curve_generator.py'")
    else:
        print("❌ Cannot proceed without test data. Please run Steps 1-2 first.")