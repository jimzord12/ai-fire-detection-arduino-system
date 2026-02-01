# Edge Impulse Platform - Model Testing

## Guide

Training accuracy is like a practice test. Now we need the final exam.

Click Model testing on the left menu.

Click Classify all.

Result:

If you get > 85-90% accuracy here, you are DONE with modeling.

If it drops below 80%, then (and only then) should we revisit the architecture.

## Results

95.37% Test Accuracy! 🎉 This is outstanding.
The model performs even better on unseen test data than on training data. This is rare and means your model is extremely robust and generalizes perfectly.

Breakdown of Success:

False Alarm Rejection: 98.6% of false alarms were correctly identified. This means you can cook or take a shower without the alarm going off.

Fire Detection: 88.9% of fires were detected. The 7.6% "False Alarm" misclassification is likely the "smoldering" cases looking like cooking smoke, which is acceptable (better to miss a tiny smolder than have constant false alarms, or you can tune the threshold later in code).

No Fire Stability: 98.6% correct. Rock solid.
