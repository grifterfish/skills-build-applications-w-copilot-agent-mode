from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Teams
        marvel = Team.objects.create(name='marvel')
        dc = Team.objects.create(name='dc')

        # Users
        ironman = User.objects.create(email='ironman@marvel.com', name='Iron Man', team='marvel')
        captain = User.objects.create(email='captain@marvel.com', name='Captain America', team='marvel')
        batman = User.objects.create(email='batman@dc.com', name='Batman', team='dc')
        superman = User.objects.create(email='superman@dc.com', name='Superman', team='dc')

        # Activities
        Activity.objects.create(user='Iron Man', type='run', duration=30)
        Activity.objects.create(user='Captain America', type='cycle', duration=45)
        Activity.objects.create(user='Batman', type='swim', duration=25)
        Activity.objects.create(user='Superman', type='fly', duration=60)

        # Leaderboard
        Leaderboard.objects.create(team='marvel', points=75)
        Leaderboard.objects.create(team='dc', points=85)

        # Workouts
        Workout.objects.create(name='Pushups', description='Do 20 pushups')
        Workout.objects.create(name='Situps', description='Do 30 situps')
        Workout.objects.create(name='Flying', description='Fly for 10 minutes')

        self.stdout.write(self.style.SUCCESS('Test data populated successfully.'))
