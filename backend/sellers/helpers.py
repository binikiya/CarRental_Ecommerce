import csv
from django.http import HttpResponse
from .models import AuditLog

def log_action(request, action_type):
    """
    Utility function to record system events.
    :param request: The Django request object (to get user, IP, and Agent)
    :param action_type: One of the ACTION_CHOICES from the AuditLog model
    """
    user = request.user if request.user.is_authenticated else None

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    user_agent = request.META.get('HTTP_USER_AGENT', '')[:255]

    AuditLog.objects.create(
        user=user,
        action=action_type,
        ip_address=ip,
        user_agent=user_agent
    )

def export_to_csv(queryset, field_names, filename):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{filename}.csv"'
    
    writer = csv.writer(response)
    writer.writerow(field_names)
    
    for obj in queryset:
        row = []
        for field in field_names:
            attr = obj
            for part in field.split('.'):
                attr = getattr(attr, part, None)
            row.append(attr)
        writer.writerow(row)
        
    return response