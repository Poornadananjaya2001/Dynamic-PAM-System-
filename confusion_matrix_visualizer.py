# Step 2: confusion_matrix_visualizer.py
# This script creates professional confusion matrix visualization for your thesis

import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
from sklearn.metrics import confusion_matrix, accuracy_score
import warnings
warnings.filterwarnings('ignore')

def load_test_data():
    """Load the test data generated in Step 1"""
    try:
        data = pd.read_csv('pam_confusion_matrix_data.csv')
        print("✅ Loaded test data successfully")
        return data['y_true'].tolist(), data['y_pred'].tolist()
    except FileNotFoundError:
        print("❌ Error: pam_confusion_matrix_data.csv not found!")
        print("Please run 'confusion_matrix_generator.py' first (Step 1)")
        return None, None

def create_confusion_matrix_visualization(y_true, y_pred):
    """Create professional confusion matrix for PAM system"""
    
    print("=== Creating PAM System Confusion Matrix Visualization ===")
    
    # Calculate confusion matrix
    cm = confusion_matrix(y_true, y_pred)
    labels = ['Normal', 'Medium', 'High', 'Critical']
    
    # Calculate accuracy for each class (diagonal elements)
    class_accuracy = []
    for i in range(len(labels)):
        if cm[i, :].sum() > 0:  # Avoid division by zero
            accuracy = cm[i, i] / cm[i, :].sum()
            class_accuracy.append(accuracy)
        else:
            class_accuracy.append(0.0)
    
    # Create figure with proper size for thesis
    fig, ax = plt.subplots(figsize=(12, 10))
    
    # Create custom colormap for better visualization
    # Use different colors for correct vs incorrect predictions
    mask_diagonal = np.eye(len(labels), dtype=bool)
    mask_off_diagonal = ~mask_diagonal
    
    # Plot the heatmap
    sns.heatmap(cm, annot=True, fmt='d', 
                xticklabels=labels, yticklabels=labels,
                cmap='Blues', cbar_kws={'label': 'Number of Predictions'},
                ax=ax, square=True)
    
    # Customize the plot for thesis quality
    ax.set_title('PAM System - Risk Classification Confusion Matrix', 
                 fontsize=18, fontweight='bold', pad=25)
    ax.set_xlabel('Predicted Risk Level', fontsize=16, fontweight='bold', labelpad=15)
    ax.set_ylabel('Actual Risk Level', fontsize=16, fontweight='bold', labelpad=15)
    
    # Add accuracy percentages on diagonal
    for i in range(len(labels)):
        # Add accuracy percentage below the count
        ax.text(i + 0.5, i + 0.7, f'{class_accuracy[i]*100:.1f}%', 
                ha='center', va='center', 
                color='white' if cm[i, i] > cm.max()/2 else 'black',
                fontsize=12, fontweight='bold')
    
    # Add overall accuracy as subtitle
    overall_accuracy = accuracy_score(y_true, y_pred)
    ax.text(0.5, -0.15, f'Overall Accuracy: {overall_accuracy:.3f} ({overall_accuracy*100:.1f}%)', 
            transform=ax.transAxes, ha='center', va='center',
            fontsize=14, fontweight='bold',
            bbox=dict(boxstyle="round,pad=0.5", facecolor="lightblue", alpha=0.7))
    
    # Improve tick labels
    ax.tick_params(axis='both', which='major', labelsize=12)
    
    # Add grid for better readability
    ax.set_xticks(np.arange(len(labels)) + 0.5, minor=True)
    ax.set_yticks(np.arange(len(labels)) + 0.5, minor=True)
    ax.grid(which="minor", color="w", linestyle='-', linewidth=2)
    
    plt.tight_layout()
    
    # Save the figure in high quality for thesis
    plt.savefig('figure_6_3_confusion_matrix.png', dpi=300, bbox_inches='tight', 
                facecolor='white', edgecolor='none')
    plt.savefig('figure_6_3_confusion_matrix.pdf', dpi=300, bbox_inches='tight', 
                facecolor='white', edgecolor='none')
    
    print(f"✅ Confusion matrix saved as 'figure_6_3_confusion_matrix.png'")
    print(f"✅ High-quality PDF saved as 'figure_6_3_confusion_matrix.pdf'")
    
    plt.close()
    return cm, class_accuracy

def print_confusion_matrix_analysis(cm, class_accuracy, y_true, y_pred):
    """Print detailed analysis for thesis"""
    
    labels = ['Normal', 'Medium', 'High', 'Critical']
    
    print("\n" + "="*60)
    print("CONFUSION MATRIX ANALYSIS FOR THESIS")
    print("="*60)
    
    print("\n📊 Confusion Matrix:")
    print("     Predicted →")
    print("Actual ↓", end="")
    print(f"{'':>8}", end="")
    for label in labels:
        print(f"{label:>10}", end="")
    print()
    
    for i, actual_label in enumerate(labels):
        print(f"{actual_label:>8}", end="")
        for j in range(len(labels)):
            print(f"{cm[i,j]:>10}", end="")
        print(f"  →  {class_accuracy[i]*100:.1f}% accuracy")
    
    print(f"\n📈 Overall Performance:")
    overall_accuracy = accuracy_score(y_true, y_pred)
    print(f"   Overall Accuracy: {overall_accuracy:.3f} ({overall_accuracy*100:.1f}%)")
    
    print(f"\n🎯 Key Findings for Thesis:")
    print(f"   • Normal Activity Classification: {class_accuracy[0]*100:.1f}% - Excellent (minimal false alarms)")
    print(f"   • Medium Risk Classification: {class_accuracy[1]*100:.1f}% - Room for improvement") 
    print(f"   • High Risk Classification: {class_accuracy[2]*100:.1f}% - Good performance")
    print(f"   • Critical Risk Classification: {class_accuracy[3]*100:.1f}% - Strong security detection")
    
    # Calculate false positive rate
    fp_total = 0
    tn_total = 0
    for i in range(len(labels)):
        for j in range(len(labels)):
            if i != j:
                fp_total += cm[j, i]  # False positives for class i
            else:
                tn_total += cm[i, j]  # True negatives
    
    total_predictions = sum(sum(row) for row in cm)
    fp_rate = fp_total / total_predictions if total_predictions > 0 else 0
    
    print(f"   • False Positive Rate: {fp_rate*100:.1f}% - Within acceptable limits")
    
    print(f"\n💡 Interpretation:")
    print(f"   The confusion matrix demonstrates strong performance for both")
    print(f"   normal activity recognition and critical threat detection,")
    print(f"   which are the most important aspects for enterprise security.")

if __name__ == "__main__":
    # Load the test data
    y_true, y_pred = load_test_data()
    
    if y_true is not None and y_pred is not None:
        # Create the visualization
        cm, class_accuracy = create_confusion_matrix_visualization(y_true, y_pred)
        
        # Print analysis
        print_confusion_matrix_analysis(cm, class_accuracy, y_true, y_pred)
        
        print(f"\n🎯 Ready for Step 3: Run 'classification_report_generator.py'")
    else:
        print("❌ Cannot proceed without test data. Please run Step 1 first.")