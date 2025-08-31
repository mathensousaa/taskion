import { ApiError } from '@/lib/fetch-client'
import { taskStatusService, tasksService, usersService } from '@/modules'

export default async function TasksExample() {
  try {
    // Fetch data using the services
    const [tasks, statuses, users] = await Promise.all([
      tasksService.list(10),
      taskStatusService.list(),
      usersService.list(),
    ])

    return (
      <div className="space-y-6 p-6">
        <h1 className="font-bold text-2xl">Tasks Dashboard</h1>
        
        {/* Tasks Section */}
        <section>
          <h2 className="mb-4 font-semibold text-xl">Recent Tasks</h2>
          <div className="grid gap-4">
            {tasks.data.map((task) => (
              <div key={task.id} className="rounded-lg border p-4">
                <h3 className="font-medium">{task.title}</h3>
                {task.description && (
                  <p className="mt-1 text-gray-600">{task.description}</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-gray-500 text-sm">
                  <span>Order: {task.order}</span>
                  <span>•</span>
                  <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
          {tasks.hasMore && (
            <p className="mt-2 text-gray-500 text-sm">
              {tasks.data.length} of many tasks shown
            </p>
          )}
        </section>

        {/* Statuses Section */}
        <section>
          <h2 className="mb-4 font-semibold text-xl">Task Statuses</h2>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <span
                key={status.id}
                className="rounded-full px-3 py-1 text-sm"
                style={{ backgroundColor: status.color, color: 'white' }}
              >
                {status.name}
              </span>
            ))}
          </div>
        </section>

        {/* Users Section */}
        <section>
          <h2 className="mb-4 font-semibold text-xl">Users</h2>
          <div className="grid gap-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 rounded border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    if (error instanceof ApiError) {
      return (
        <div className="p-6">
          <h1 className="font-bold text-2xl text-red-600">Error Loading Data</h1>
          <p className="mt-2 text-red-500">
            {error.message} (Status: {error.status})
          </p>
          {error.details && (
            <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4 text-sm">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          )}
        </div>
      )
    }

    return (
      <div className="p-6">
        <h1 className="font-bold text-2xl text-red-600">Unexpected Error</h1>
        <p className="mt-2 text-red-500">
          An unexpected error occurred while loading the data.
        </p>
      </div>
    )
  }
}
