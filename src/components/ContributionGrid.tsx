import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./ContributionGrid.css";

type Day = {
    date: string;
    count: number;
    level: number;
};

type APIResponse = {
    username: string;
    total: number;
    weeks: { days: Day[] }[];
};

type Tooltip = {
    day: Day;
    x: number;
    y: number;
};

const API =
    import.meta.env.VITE_GITMOSAIC_API_URL ||
    "https://gitmosaic-api.calebcat200.workers.dev";

function formatDate(value: string): string {
    return new Date(value + "T12:00:00Z")
        .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });
}

function alignWeek(days: Day[]): (Day | null)[] {
    if (!days.length) {
        return Array(7).fill(null);
    }

    const start = new Date(days[0].date + "T00:00:00Z");
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());

    const lookup = new Map(days.map(day => [day.date, day]));

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(start);
        date.setUTCDate(date.getUTCDate() + index);

        return lookup.get(date.toISOString().slice(0, 10)) ?? null;
    });
}

export default function ContributionGrid({
    username = "calebcat300-gif",
}: {
    username?: string;
}) {
    const [data, setData] = useState<APIResponse | null>(null);
    const [error, setError] = useState("");
    const [tooltip, setTooltip] = useState<Tooltip | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                const response = await fetch(
                    `${API}/v1/users/${encodeURIComponent(username)}/contributions`,
                    { signal: controller.signal }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error ?? "api request failed");
                }

                if (!controller.signal.aborted) {
                    setData(result as APIResponse);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error ? err.message : "unknown error"
                    );
                }
            }
        }

        void load();

        const interval = window.setInterval(() => {
            void load();
        }, 5 * 60 * 1000);

        return () => {
            window.clearInterval(interval);
            controller.abort();
        };
    }, [username]);

    useEffect(() => {
        if (data && scrollRef.current) {
            scrollRef.current.scrollLeft =
                scrollRef.current.scrollWidth;
        }
    }, [data]);

    if (error) {
        return <p className="gm-message">api error: {error}</p>;
    }

    if (!data) {
        return <p className="gm-message">loading contributions...</p>;
    }

    const weeks = data.weeks.map(week => alignWeek(week.days));

    let previousMonth = "";

    const monthLabels = weeks.map(week => {
        const day = week.find(
            value =>
                value && value.date.slice(0, 7) !== previousMonth
        );

        if (!day) return "";

        previousMonth = day.date.slice(0, 7);

        return new Date(day.date + "T00:00:00Z")
            .toLocaleDateString("en-US", {
                month: "short",
                timeZone: "UTC",
            });
    });

    function showTooltip(day: Day, element: HTMLElement) {
        const rect = element.getBoundingClientRect();

        setTooltip({
            day,
            x: Math.max(
                110,
                Math.min(
                    window.innerWidth - 110,
                    rect.left + rect.width / 2
                )
            ),
            y: rect.top - 8,
        });
    }

    return (
        <section className="gm-root">
            <div className="gm-header">
                <span>contribution activity</span>
                <span className="gm-muted">
                    {data.total} contributions
                </span>
            </div>

            <div
                className="gm-scroll"
                ref={scrollRef}
                onScroll={() => setTooltip(null)}
            >
                <div className="gm-calendar">
                    <div className="gm-weekdays">
                        {["", "mon", "", "wed", "", "fri", ""].map(
                            (label, index) => (
                                <span key={index}>{label}</span>
                            )
                        )}
                    </div>

                    <div className="gm-graph">
                        <div className="gm-months">
                            {monthLabels.map((month, index) => (
                                <span key={index}>{month}</span>
                            ))}
                        </div>

                        <div className="gm-columns">
                            {weeks.map((week, weekIndex) => (
                                <div className="gm-week" key={weekIndex}>
                                    {week.map((day, dayIndex) =>
                                        day ? (
                                            <button
                                                type="button"
                                                key={day.date}
                                                className={
                                                    "gm-day level-" +
                                                    Math.max(
                                                        0,
                                                        Math.min(4, day.level)
                                                    )
                                                }
                                                aria-label={
                                                    `${formatDate(day.date)}: ` +
                                                    `${day.count} contributions`
                                                }
                                                onMouseEnter={event =>
                                                    showTooltip(
                                                        day,
                                                        event.currentTarget
                                                    )
                                                }
                                                onFocus={event =>
                                                    showTooltip(
                                                        day,
                                                        event.currentTarget
                                                    )
                                                }
                                                onMouseLeave={() =>
                                                    setTooltip(null)
                                                }
                                                onBlur={() =>
                                                    setTooltip(null)
                                                }
                                            />
                                        ) : (
                                            <span
                                                className="gm-empty"
                                                key={dayIndex}
                                            />
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="gm-footer">
                <span>@{data.username}</span>

                <div className="gm-legend">
                    <span>less</span>
                    {[0, 1, 2, 3, 4].map(level => (
                        <span
                            key={level}
                            className={`gm-swatch level-${level}`}
                        />
                    ))}
                    <span>more</span>
                </div>
            </div>

            {tooltip && createPortal(
                <div
                    className="gm-tooltip"
                    role="tooltip"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                    }}
                >
                    <strong>{formatDate(tooltip.day.date)}</strong>
                    <span>
                        {tooltip.day.count} contribution
                        {tooltip.day.count === 1 ? "" : "s"}
                    </span>
                </div>,
                document.body
            )}
        </section>
    );
}
